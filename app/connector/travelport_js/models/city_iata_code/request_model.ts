import {
    StayDetails,
    RoomFilter,
    RateFilter,
    Radius,
    CustomerLoyaltyCard,
    NegotiatedRates
} from '../base_request';

interface CityIataCodeLocationDetails {
    iataCode: string;
}

interface CityIataCodeLocationType {
    type: "cityIATACode";
    details: CityIataCodeLocationDetails;
    radius: Radius;
}

interface CityIataCodePropertyFilter {
    maxWaitTime?: number;
    location: CityIataCodeLocationType;
    chainCodes?: string[];
    customerLoyaltyCards?: CustomerLoyaltyCard[];
    hotelNameContains?: string;
    negotiatedRates?: NegotiatedRates;
    returnOnlyAvailableProperties: boolean;
    imageSize?: string;
    returnAllImageURLs?: boolean;
    recommendedPropertyAmenitiesInd?: boolean;
    amenityCategories?: string[];
}

// Extending RoomFilter to add city-specific fields
interface CityRoomFilter extends RoomFilter {
    highFloor?: boolean;
    maxOccupancy?: number;
}

// Extending RateFilter to add city-specific fields
interface CityRateFilter extends RateFilter {
    removeSpecialRates?: boolean;
    categories?: string[];
}

export interface CityIataCodeHotelSearchRequest {
    responseFields?: string[];
    requestedCurrency?: string;
    stayDetails: StayDetails;
    propertyFilter: CityIataCodePropertyFilter;
    roomFilter?: CityRoomFilter;
    rateFilter?: CityRateFilter;
}