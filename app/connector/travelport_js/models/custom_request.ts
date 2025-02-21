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