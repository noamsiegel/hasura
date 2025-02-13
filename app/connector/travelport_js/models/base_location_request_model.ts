// ... existing code ...
import {
    BasePropertyFilter,
    BaseHotelSearchRequest,
    Radius
} from './base_request';


export interface LocationDetailsBase {
    type: string;
}

export interface LocationTypeBase<T extends LocationDetailsBase> {
    type: string;
    details: T;
    radius: Radius;
}

export interface PropertyFilterWithLocation<T extends LocationTypeBase<LocationDetailsBase>> extends BasePropertyFilter {
    location: T;
}

export interface HotelSearchRequestWithLocation<T extends PropertyFilterWithLocation<LocationTypeBase<LocationDetailsBase>>> extends BaseHotelSearchRequest {
    propertyFilter: T;
}