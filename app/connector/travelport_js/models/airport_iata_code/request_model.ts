import {
    BasePropertyFilter,
    BaseHotelSearchRequest,
    Radius
} from '../base_request';

interface AirportIataCodeLocationDetails {
    iataCode: string;
}

interface AirportIataCodeLocationType {
    type: "airportIATACode";
    details: AirportIataCodeLocationDetails;
    radius: Radius;
}

interface AirportIataCodePropertyFilter extends BasePropertyFilter {
    location: AirportIataCodeLocationType;
}

export interface AirportIataCodeHotelSearchRequest extends BaseHotelSearchRequest {
    propertyFilter: AirportIataCodePropertyFilter;
    returnCompleteNightlyRateBreakdown?: boolean;
}