import {
    BasePropertyFilter,
    BaseHotelSearchRequest,
} from '../base_request';

export interface PropertyDetails {
    chainCode: string;
    propertyCode: string;
}

// Note: Property search is slightly different as it uses propertyKeys instead of location
export interface PropertyFilter extends BasePropertyFilter {
    propertyKeys: PropertyDetails[];
}

export interface PropertyHotelSearchRequest extends BaseHotelSearchRequest {
    propertyFilter: PropertyFilter;
}