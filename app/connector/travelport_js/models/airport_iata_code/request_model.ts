// import {
//     BasePropertyFilter,
//     BaseHotelSearchRequest,
//     Radius
// } from '../base_request';

// interface AirportIataCodeLocationDetails {
//     iataCode: string;
// }

// interface AirportIataCodeLocationType {
//     type: "airportIATACode";
//     details: AirportIataCodeLocationDetails;
//     radius: Radius;
// }

// interface AirportIataCodePropertyFilter extends BasePropertyFilter {
//     location: AirportIataCodeLocationType;
// }

// export interface AirportIataCodeHotelSearchRequest extends BaseHotelSearchRequest {
//     propertyFilter: AirportIataCodePropertyFilter;
//     returnCompleteNightlyRateBreakdown?: boolean;
// }

import {
    LocationDetailsBase,
    LocationTypeBase,
    PropertyFilterWithLocation,
    HotelSearchRequestWithLocation
} from '../base_location_request_model';

import { StayDetails } from '../base_request';

export interface AirportIataCodeLocationDetails extends LocationDetailsBase {
    iataCode: string;
}

export interface AirportIataCodeLocationType extends LocationTypeBase<AirportIataCodeLocationDetails> {
    type: "airportIATACode";
}

export interface AirportIataCodePropertyFilter extends PropertyFilterWithLocation<AirportIataCodeLocationType> {
    returnOnlyAvailableProperties: boolean;
    hotelNameContains?: string;
}

export interface AirportIataCodeHotelSearchRequest {
    propertyFilter: AirportIataCodePropertyFilter;
    stayDetails: StayDetails;
    returnCompleteNightlyRateBreakdown?: boolean;
}