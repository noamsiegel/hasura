import {
    BasePropertyFilter,
    BaseHotelSearchRequest,
    Radius
} from '../base_request';

interface CityIataCodeLocationDetails {
    iataCode: string;
}

interface CityIataCodeLocationType {
    type: "cityIATACode";
    details: CityIataCodeLocationDetails;
    radius: Radius;
}

interface CityIataCodePropertyFilter extends BasePropertyFilter {
    location: CityIataCodeLocationType;
}

export interface CityIataCodeHotelSearchRequest extends BaseHotelSearchRequest {
    propertyFilter: CityIataCodePropertyFilter;
}