interface Guest {
    age: number;
}

interface Guests {
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
