import {
    StayDetails,
    RoomFilter,
    RateFilter,
    Radius,
    CustomerLoyaltyCard,
    NegotiatedRates
} from '../base_request';

interface AirportIataCodeLocationDetails {
    iataCode: string;
}

interface AirportIataCodeLocationType {
    type: "airportIATACode";
    details: AirportIataCodeLocationDetails;
    radius: Radius;
}

interface AirportIataCodePropertyFilter {
    maxWaitTime?: number;
    location: AirportIataCodeLocationType;
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

export interface AirportIataCodeHotelSearchRequest {
    requestedCurrency?: string;
    stayDetails: StayDetails;
    propertyFilter: AirportIataCodePropertyFilter;
    roomFilter?: RoomFilter;
    rateFilter?: RateFilter;
    returnCompleteNightlyRateBreakdown?: boolean;
}