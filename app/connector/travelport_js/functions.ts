// Import necessary types and utilities
import { UnprocessableContent } from './errors';


// requests
import { CityIataCodeHotelSearchRequest } from './models/city_iata_code/request_model';
import { CoordinatesHotelSearchRequest } from './models/coordinates/request_model';
import { AirportIataCodeHotelSearchRequest } from './models/airport_iata_code/request_model';
import { PropertyHotelSearchRequest } from './models/property/request_model';
import { AddressHotelSearchRequest } from './models/address/request_model';

// responses
import { AddressResponse } from './models/address/response_model';
import { AirportIataCodeResponse } from './models/airport_iata_code/response_model';
import { CityIataCodeResponse } from './models/city_iata_code/response_model';
import { CoordinatesResponse } from './models/coordinates/response_model';
import { PropertyResponse } from './models/property/response_model';

import axios, { AxiosInstance } from 'axios';

// TODO make business logic make sure that checkin and checkout dates are valid (on or after today)
/**
 * TravelPort API client class
 */
class TravelPortClient {
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
      
      this.log('OAuth request payload:\n' + JSON.stringify(oauthPayload, null, 2) + '\n');

      // Get OAuth token with explicit content type
      const tokenResponse = await axios.post(oauthUrl!, oauthPayload, {
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
        }, null, 2) + '\n');
      }
      this.log(JSON.stringify({
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      }, null, 2) + '\n');
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
      this.log('Request payload:\n' + JSON.stringify(searchParams, null, 2) + '\n');

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
        }, null, 2) + '\n');

        const response = await client.post(
          'https://api.travelport.com/12/hotel/search/searchcomplete',
          searchParams,
          {
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            transformRequest: [(data) => {
              this.log('Transforming request data:\n' + JSON.stringify(data, null, 2) + '\n');
              return JSON.stringify(data);
            }]
          }
        );
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
          }, null, 2) + '\n'
        );
        throw axiosError;
      }
    } catch (e) {
      this.log('Final error occurred\n');
      throw new UnprocessableContent(
        `Hotel search failed: ${e instanceof Error ? e.message : String(e)}`,
        { error: 'Failed to search hotels' }
      );
    } finally {
      this.log('=== SEARCH DEBUG END ===\n');
    }
  }
}

/**
 * Search hotels by coordinates
 */
/** @readonly */
export async function tpSearchHotelsByCoordinates(
  searchParams: CoordinatesHotelSearchRequest
): Promise<CoordinatesResponse> {
  return await TravelPortClient.searchHotels<CoordinatesResponse>(searchParams);
}

/**
 * Search hotels by airport IATA code
 */
/** @readonly */
export async function tpSearchHotelsByAirportIataCode(
  searchParams: AirportIataCodeHotelSearchRequest
): Promise<AirportIataCodeResponse> {
  return await TravelPortClient.searchHotels<AirportIataCodeResponse>(searchParams);
}

/**
 * Search hotels by property
 */
/** @readonly */
export async function tpSearchHotelsByProperty(
  searchParams: PropertyHotelSearchRequest
): Promise<PropertyResponse> {
  return await TravelPortClient.searchHotels<PropertyResponse>(searchParams);
}

/**
 * Search hotels by address using custom parameters
 */
/** @readonly */
export async function tpSearchHotelsByAddress(
    searchParams: AddressHotelSearchRequest
): Promise<AddressResponse> {
    return await TravelPortClient.searchHotels<AddressResponse>(searchParams);
}

/**
 * Search hotels by city IATA code using custom parameters
 */
/** @readonly */
export async function tpSearchHotelsByCityIataCode(
    searchParams: CityIataCodeHotelSearchRequest
): Promise<CityIataCodeResponse> {
    return await TravelPortClient.searchHotels<CityIataCodeResponse>(searchParams);
}
