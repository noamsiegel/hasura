import {
    BasePropertyFilter,
    BaseHotelSearchRequest
} from '../base_request';

interface PropertyKey {
    chainCode: string;
    propertyCode: string;
}

// Note: Property search is slightly different as it uses propertyKeys instead of location
interface PropertyFilter extends Omit<BasePropertyFilter, 'chainCodes'> {
    propertyKeys: PropertyKey[];
}

export interface PropertyHotelSearchRequest extends BaseHotelSearchRequest {
    propertyFilter: PropertyFilter;
}