import {
    StayDetails,
    RoomFilter,
    RateFilter,
    Radius,
    CustomerLoyaltyCard,
    NegotiatedRates
} from '../base_request';

interface AddressLocationDetails {
    countryCode: string;
    stateProvince: string;
    cityName: string;
}

interface AddressLocationType {
    type: "address";
    details: AddressLocationDetails;
    radius: Radius;
}

interface AddressPropertyFilter {
    maxWaitTime?: number;
    location: AddressLocationType;
    chainCodes?: string[];
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

export interface AddressHotelSearchRequest {
    responseFields?: string[];
    requestedCurrency?: string;
    stayDetails: StayDetails;
    propertyFilter: AddressPropertyFilter;
    roomFilter?: RoomFilter;
    rateFilter?: RateFilter;
}