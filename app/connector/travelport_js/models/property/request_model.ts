// import {
//     BasePropertyFilter,
//     BaseHotelSearchRequest
// } from '../base_request';

// interface PropertyKey {
//     chainCode: string;
//     propertyCode: string;
// }

// // Note: Property search is slightly different as it uses propertyKeys instead of location
// interface PropertyFilter extends Omit<BasePropertyFilter, 'chainCodes'> {
//     propertyKeys: PropertyKey[];
// }

// export interface PropertyHotelSearchRequest extends BaseHotelSearchRequest {
//     propertyFilter: PropertyFilter;
// }

import {
    LocationDetailsBase,
    LocationTypeBase,
    PropertyFilterWithLocation,
    HotelSearchRequestWithLocation
} from '../base_location_request_model';

import { StayDetails } from '../base_request';

export interface HotelCodeLocationDetails extends LocationDetailsBase {
    hotels: {
        chainCode: string;
        propertyCode: string;
    }[];
}

export interface HotelCodeLocationType extends LocationTypeBase<HotelCodeLocationDetails> {
    type: "address";
}

export interface PropertyKey {
    chainCode: string;
    propertyCode: string;
}

export interface HotelCodePropertyFilter {
    propertyKeys: PropertyKey[];
    returnOnlyAvailableProperties?: boolean;
    hotelNameContains?: string;
}

export interface HotelCodeHotelSearchRequest {
    propertyFilter: HotelCodePropertyFilter;
    stayDetails: StayDetails;
}