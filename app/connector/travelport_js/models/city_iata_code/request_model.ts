import {
    LocationDetailsBase,
    LocationTypeBase,
    PropertyFilterWithLocation,
    HotelSearchRequestWithLocation
} from '../base_location_request_model';


export interface CityIataCodeLocationDetails extends LocationDetailsBase {
    iataCode: string;
}

export interface CityIataCodeLocationType extends LocationTypeBase<CityIataCodeLocationDetails> {
    type: "cityIATACode";
}

export interface CityIataCodePropertyFilter extends PropertyFilterWithLocation<CityIataCodeLocationType> {}

export interface CityIataCodeHotelSearchRequest extends HotelSearchRequestWithLocation<CityIataCodePropertyFilter> {}