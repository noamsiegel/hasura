import { AddressHotelSearchRequest } from "./address/request_model";

// New interface for the custom request
export interface CustomHotelSearchParams {
    // Location fields
    cityName: string;
    stateProvince: string;
    countryCode: string;

    // Location radius
    radius: number;
    unit: string;

    // Stay details
    checkInDate: string;
    checkOutDate: string;
    rooms: number;
    adults: number;
    children?: { age: number }[];

    // Hotel filters
    hotelName?: string;
    chainIds?: string;
    advancedAccessibilityOnly?: boolean;

    // Pagination
    offset?: number;
    limit?: number;

    // Search options
    timeout?: number;
    responseFields?: string[];
    requestedCurrency?: string;
    imageSize?: string;
    returnAllImageURLs?: boolean;
    recommendedPropertyAmenitiesInd?: boolean;
    amenityCategories?: string[];

    // Room filters
    nonSmoking?: boolean;
    balcony?: boolean;
    connecting?: boolean;
    family?: boolean;
    highFloor?: boolean;
    maxOccupancy?: number;
    bedConfiguration?: {
        minimumQuantity: number;
        type: string;
    };
    amenityCodes?: number[];
    recommendedRoomAmenitiesInd?: boolean;

    // Rate filters
    rateFlags?: {
        refundable?: boolean;
        commissionable?: boolean;
        deposit?: boolean;
        prepay?: boolean;
        postpay?: boolean;
        breakfast?: boolean;
        lunch?: boolean;
        dinner?: boolean;
    };
    publicRateBlacklist?: string[];
    removeSpecialRates?: boolean;
    rateCategories?: string[];

    // Loyalty and negotiated rates
    customerLoyaltyCards?: {
        value: string;
        supplierCode: string;
        supplierType: string;
    }[];
    negotiatedRates?: {
        rateCodes?: string[];
        masterRateCode?: string;
    };


}

// Update the existing convertToAddressHotelSearchRequest to handle more fields
export function convertToAddressHotelSearchRequest(params: CustomHotelSearchParams): AddressHotelSearchRequest {
    console.log('\n=== ADDRESS CONVERSION DEBUG START ===');
    console.log('Input params:', JSON.stringify(params, null, 2));
    
    const convertedRequest: AddressHotelSearchRequest = {
        responseFields: params.responseFields,
        requestedCurrency: params.requestedCurrency,
        stayDetails: {
            checkInDateLocal: params.checkInDate,
            checkOutDateLocal: params.checkOutDate,
            rooms: params.rooms,
            guests: {
                adults: params.adults,
                children: params.children
            }
        },
        propertyFilter: {
            location: {
                type: "address" as const,
                details: {
                    countryCode: params.countryCode,
                    cityName: params.cityName,
                    stateProvince: params.stateProvince,
                },
                radius: {
                    value: params.radius || 5,
                    unit: params.unit || "mi"
                }
            },
            returnOnlyAvailableProperties: true,
            hotelNameContains: params.hotelName,
            chainCodes: params.chainIds?.split(','),
            maxWaitTime: params.timeout,
            imageSize: params.imageSize,
            returnAllImageURLs: params.returnAllImageURLs,
            recommendedPropertyAmenitiesInd: params.recommendedPropertyAmenitiesInd,
            categories: params.amenityCategories,
            customerLoyaltyCards: params.customerLoyaltyCards,
            negotiatedRates: params.negotiatedRates,
            removeSpecialRates: params.removeSpecialRates
        },
        roomFilter: params.nonSmoking || params.balcony || params.connecting || params.family || 
                   params.highFloor || params.maxOccupancy || params.bedConfiguration || 
                   params.amenityCodes || params.recommendedRoomAmenitiesInd || 
                   params.advancedAccessibilityOnly ? {
            nonSmoking: params.nonSmoking,
            balcony: params.balcony,
            connecting: params.connecting,
            family: params.family,
            bedConfiguration: params.bedConfiguration,
            amenityCodes: params.amenityCodes,
            recommendedRoomAmenitiesInd: params.recommendedRoomAmenitiesInd,
            accessible: params.advancedAccessibilityOnly
        } : undefined,
        rateFilter: params.rateFlags || params.publicRateBlacklist || params.rateCategories ? {
            rateFlags: params.rateFlags,
            publicRateBlacklist: params.publicRateBlacklist
        } : undefined
    };

    console.log('Converted request:', JSON.stringify(convertedRequest, null, 2));
    console.log('=== ADDRESS CONVERSION DEBUG END ===\n');
    return convertedRequest;
}