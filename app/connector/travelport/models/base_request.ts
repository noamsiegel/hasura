export interface Guest {
    age: number;
}

export interface Guests {
    adults: number;
    children?: Guest[];
}

export interface StayDetails {
    checkInDateLocal: string;
    checkOutDateLocal: string;
    rooms: number;
    guests: Guests;
}

export interface Radius {
    value: number;
    unit: string;
}

export interface CustomerLoyaltyCard {
    value: string;
    supplierCode: string;
    supplierType: string;
}

export interface NegotiatedRates {
    rateCodes?: string[];
    masterRateCode?: string;
}

interface BedConfiguration {
    minimumQuantity: number;
    type: string;
}

export interface RoomFilter {
    nonSmoking?: boolean;
    balcony?: boolean;
    accessible?: boolean;
    connecting?: boolean;
    family?: boolean;
    bedConfiguration?: BedConfiguration;
    amenityCodes?: number[];
    recommendedRoomAmenitiesInd?: boolean;
}

interface RateFlags {
    refundable?: boolean;
    commissionable?: boolean;
    deposit?: boolean;
    prepay?: boolean;
    postpay?: boolean;
    breakfast?: boolean;
    lunch?: boolean;
    dinner?: boolean;
}

export interface RateFilter {
    rateFlags?: RateFlags;
    publicRateBlacklist?: string[];
}

export interface BasePropertyFilter {
    maxWaitTime?: number;
    chainCodes?: string[];
    customerLoyaltyCards?: CustomerLoyaltyCard[];
    hotelNameContains?: string;
    negotiatedRates?: NegotiatedRates;
    returnOnlyAvailableProperties?: boolean;
    imageSize?: string;
    returnAllImageURLs?: boolean;
    recommendedPropertyAmenitiesInd?: boolean;
    removeSpecialRates?: boolean;
    categories?: string[];
}

export interface BaseHotelSearchRequest {
    stayDetails: StayDetails;
    responseFields?: string[];
    requestedCurrency?: string;
    roomFilter?: RoomFilter;
    rateFilter?: RateFilter;
}
