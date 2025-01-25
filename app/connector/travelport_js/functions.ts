// requests
import { CityIataCodeHotelSearchRequest } from './models/city_iata_code/request_model';
import { CoordinatesHotelSearchRequest } from './models/coordinates/request_model';
import { AirportIataCodeHotelSearchRequest } from './models/airport_iata_code/request_model';
import { PropertyHotelSearchRequest } from './models/property/request_model';
import { AddressHotelSearchRequest } from './models/address/request_model';

// responses
import { AddressResponse } from './models/address/response_model';
import { AirportIataCodeResponse } from './models/airport_iata_code/response_model';
import { CityIataCodeResponse } from './models/city_iata_code/response_model';
import { CoordinatesResponse } from './models/coordinates/response_model';
import { PropertyResponse } from './models/property/response_model';

import { TravelPortClient } from './client';

// TODO make business logic make sure that checkin and checkout dates are valid (on or after today)

/**
 * Search hotels by coordinates
 */
/** @readonly */
export async function tpSearchHotelsByCoordinates(
  searchParams: CoordinatesHotelSearchRequest
): Promise<CoordinatesResponse> {
  return await TravelPortClient.searchHotels<CoordinatesResponse>(searchParams);
}

/**
 * Search hotels by airport IATA code
 */
/** @readonly */
export async function tpSearchHotelsByAirportIataCode(
  searchParams: AirportIataCodeHotelSearchRequest
): Promise<AirportIataCodeResponse> {
  return await TravelPortClient.searchHotels<AirportIataCodeResponse>(searchParams);
}

/**
 * Search hotels by property
 */
/** @readonly */
export async function tpSearchHotelsByProperty(
  searchParams: PropertyHotelSearchRequest
): Promise<PropertyResponse> {
  return await TravelPortClient.searchHotels<PropertyResponse>(searchParams);
}

/**
 * Search hotels by address using custom parameters
 */
/** @readonly */
export async function tpSearchHotelsByAddress(
    searchParams: AddressHotelSearchRequest
): Promise<AddressResponse> {
    return await TravelPortClient.searchHotels<AddressResponse>(searchParams);
}

/**
 * Search hotels by city IATA code using custom parameters
 */
/** @readonly */
export async function tpSearchHotelsByCityIataCode(
    searchParams: CityIataCodeHotelSearchRequest
): Promise<CityIataCodeResponse> {
    return await TravelPortClient.searchHotels<CityIataCodeResponse>(searchParams);
}
