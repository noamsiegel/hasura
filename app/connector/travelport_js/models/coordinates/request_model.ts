import {
    StayDetails,
    RoomFilter,
    RateFilter,
    Radius,
    NegotiatedRates,
    CustomerLoyaltyCard
  } from '../base_request';
  
  interface CoordinatesLocationDetails {
    latitude: string;
    longitude: string;
  }
  
  interface CoordinatesLocationType {
    type: "coordinates";
    details: CoordinatesLocationDetails;
    radius: Radius;
  }
  
  interface CoordinatesPropertyFilter {
    maxWaitTime?: number;
    location: CoordinatesLocationType;
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
  
  export interface CoordinatesHotelSearchRequest {
    responseFields?: string[];
    requestedCurrency?: string;
    stayDetails: StayDetails;
    propertyFilter: CoordinatesPropertyFilter;
    roomFilter?: RoomFilter;
    rateFilter?: RateFilter;
  }