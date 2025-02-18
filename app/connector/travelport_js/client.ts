import axios,{ AxiosInstance } from 'axios';
import { UnprocessableContent } from './errors';
import { neon } from '@neondatabase/serverless';
import * as sdk from "@hasura/ndc-lambda-sdk";



const sql = neon(process.env.NEON_DATABASE_URL ?? '');

/**
 * TravelPort API client class
 */

export class TravelPortClient {
    private static debug: boolean = false;

    /**
     * Enable or disable debug logging
     */
    public static setDebug(enabled: boolean): void {
        this.debug = enabled;
    }

    /**
     * Debug logging helper
     */
    private static log(message: string): void {
        if (this.debug) {
            process.stdout.write(message);
        }
    }

    private static async createConnection(): Promise<AxiosInstance> {
        this.log('\n=== CONNECTION DEBUG START ===\n');
        try {
            // Load environment variables
            const clientId = process.env.TRAVELPORT_CLIENT_ID;
            const clientSecret = process.env.TRAVELPORT_CLIENT_SECRET;
            const oauthUrl = process.env.TRAVELPORT_OAUTH_URL;
            const username = process.env.TRAVELPORT_USERNAME;
            const password = process.env.TRAVELPORT_PASSWORD;
            const accessGroup = process.env.TRAVELPORT_ACCESS_GROUP;

            this.log('Env vars loaded, attempting OAuth request\n');

            // Log OAuth request details
            const oauthPayload = {
                grant_type: 'password',
                username,
                password,
                client_id: clientId,
                client_secret: clientSecret,
            };

            this.log('OAuth request payload:\n' + JSON.stringify(oauthPayload,null,2) + '\n');

            // Get OAuth token with explicit content type
            const tokenResponse = await axios.post(oauthUrl!,oauthPayload,{
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',  // Changed from application/json
                }
            });

            this.log('OAuth token received\n');

            // Create axios instance with default headers
            const axiosInstance = axios.create({
                headers: {
                    'Content-Type': 'application/json',
                    'XAUTH_TRAVELPORT_ACCESSGROUP': accessGroup,
                    'Authorization': `Bearer ${tokenResponse.data.access_token}`,
                },
            });

            this.log('Connection created successfully\n');
            return axiosInstance;
        } catch (error) {
            this.log('Error creating connection:\n');
            if (axios.isAxiosError(error)) {
                this.log('Axios Error Details:\n' + JSON.stringify({
                    status: error.response?.status,
                    statusText: error.response?.statusText,
                    data: error.response?.data,
                    headers: error.config?.headers
                },null,2) + '\n');
            }
            this.log(JSON.stringify({
                error: error instanceof Error ? error.message : String(error),
                stack: error instanceof Error ? error.stack : undefined
            },null,2) + '\n');
            throw error;
        } finally {
            this.log('=== CONNECTION DEBUG END ===\n');
        }
    }

    // Helper method to make API calls
    static async searchHotels<T>(searchParams: any): Promise<T> {
        this.log('\n=== SEARCH DEBUG START ===\n');
        try {
            this.log('Creating connection...\n');
            const client = await this.createConnection();

            this.log('Preparing request...\n');
            this.log('Request payload:\n' + JSON.stringify(searchParams,null,2) + '\n');

            try {
                this.log('Sending request...\n');
                // Log full request details
                this.log('Full request config:\n' + JSON.stringify({
                    url: 'https://api.travelport.com/12/hotel/search/searchcomplete',
                    method: 'POST',
                    headers: {
                        ...client.defaults.headers,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    data: searchParams
                },null,2) + '\n');

                const response = await client.post(
                    'https://api.travelport.com/12/hotel/search/searchcomplete',
                    searchParams,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        transformRequest: [(data) => {
                            this.log('Transforming request data:\n' + JSON.stringify(data,null,2) + '\n');
                            return JSON.stringify(data);
                        }]
                    }
                );
                // NOTE: this is for uploading to neon database for caching purposes
                // try {
                //     await sql`
                // 			INSERT INTO travelport_payloads (payload, created_at)
                // 			VALUES (${response.data}, NOW())
                // 		`;
                //     this.log('Response saved to Neon database\n');
                // } catch (error) {
                //     this.log('Error inserting payload into Neon:\n' + JSON.stringify(error,null,2) + '\n');
                // }
                this.log('Response received successfully\n');
                return response.data as T;
            } catch (axiosError: any) {
                this.log('Request failed:\n' +
                    JSON.stringify({
                        status: axiosError.response?.status,
                        statusText: axiosError.response?.statusText,
                        data: axiosError.response?.data,
                        requestPayload: searchParams,
                        requestHeaders: axiosError.config?.headers,
                        requestData: axiosError.config?.data
                    },null,2) + '\n'
                );

                // Extract the actual Travelport error message
                const travelportError = axiosError.response?.data?.errors?.[0];
                const errorMessage = travelportError?.details || travelportError?.message ||
                    'Hotel search failed due to an unknown error';

                throw new sdk.UnprocessableContent(
                    errorMessage,
                    {
                        error: 'Hotel search failed',
                        details: {
                            code: travelportError?.code,
                            category: travelportError?.category,
                            source: travelportError?.source
                        }
                    }
                );
            }
        } catch (e) {
            this.log('Final error occurred\n');
            throw new sdk.UnprocessableContent(
                'Hotel search failed due to an unexpected error',
                {
                    error: 'Unexpected error',
                    details: e instanceof Error ? e.message : undefined
                }
            );
        } finally {
            this.log('=== SEARCH DEBUG END ===\n');
        }
    }
}