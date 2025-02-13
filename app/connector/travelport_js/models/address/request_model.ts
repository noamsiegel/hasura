// import {
//     Radius,
//     BasePropertyFilter,
//     BaseHotelSearchRequest
// } from '../base_request';

import {
    LocationDetailsBase,
    LocationTypeBase,
    PropertyFilterWithLocation,
    HotelSearchRequestWithLocation
} from '../base_location_request_model';

// export interface AddressLocationDetails {
//     countryCode: string;
//     stateProvince: string;
//     cityName: string;
// }

// export interface AddressLocationType {
//     type: "address";
//     details: AddressLocationDetails;
//     radius: Radius;
// }

// export interface AddressPropertyFilter extends BasePropertyFilter {
//     location: AddressLocationType;
// }

// export interface AddressHotelSearchRequest extends BaseHotelSearchRequest {
//     propertyFilter: AddressPropertyFilter;
// }

// ... existing code ...

export interface AddressLocationDetails extends LocationDetailsBase {
    countryCode: string;
    stateProvince: string;
    cityName: string;
}

export interface AddressLocationType extends LocationTypeBase<AddressLocationDetails> {
    type: "address";
}

export interface AddressPropertyFilter extends PropertyFilterWithLocation<AddressLocationType> {}

export interface AddressHotelSearchRequest extends HotelSearchRequestWithLocation<AddressPropertyFilter> {}