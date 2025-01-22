import {
    StayDetails,
    RoomFilter,
    RateFilter,
    CustomerLoyaltyCard,
    NegotiatedRates
} from '../base_request';

interface PropertyKey {
    chainCode: string;
    propertyCode: string;
}

interface PropertyFilter {
    maxWaitTime?: number;
    propertyKeys: PropertyKey[];
    customerLoyaltyCards?: CustomerLoyaltyCard[];
    hotelNameContains?: string;
    negotiatedRates?: NegotiatedRates;
    returnOnlyAvailableProperties: boolean;
    imageSize?: string;
    returnAllImageURLs?: boolean;
    recommendedPropertyAmenitiesInd?: boolean;
    removeSpecialRates?: boolean;
    categories?: string[];
}

export interface PropertyHotelSearchRequest {
    responseFields?: string[];
    requestedCurrency?: string;
    stayDetails: StayDetails;
    propertyFilter: PropertyFilter;
    roomFilter?: RoomFilter;
    rateFilter?: RateFilter;
}