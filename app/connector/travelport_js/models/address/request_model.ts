import {
    Radius,
    BasePropertyFilter,
    BaseHotelSearchRequest
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

interface AddressPropertyFilter extends BasePropertyFilter {
    location: AddressLocationType;
}

export interface AddressHotelSearchRequest extends BaseHotelSearchRequest {
    propertyFilter: AddressPropertyFilter;
}