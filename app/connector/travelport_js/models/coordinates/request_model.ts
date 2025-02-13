import {
    BasePropertyFilter,
    BaseHotelSearchRequest,
    Radius
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

export interface CoordinatesPropertyFilter extends BasePropertyFilter {
    location: CoordinatesLocationType;
}

export interface CoordinatesHotelSearchRequest extends BaseHotelSearchRequest {
    propertyFilter: CoordinatesPropertyFilter;
}