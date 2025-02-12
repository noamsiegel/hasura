// requests
import { CoordinatesHotelSearchRequest } from './models/coordinates/request_model';
// import { AirportIataCodeHotelSearchRequest } from './models/airport_iata_code/request_model';
import { CustomAirportIataCodeHotelSearchRequest, mapCustomToAirportIataCodeRequest } from './models/airport_iata_code/custom_request_model';
import { CustomHotelSearchRequest, mapCustomToAddressRequest } from './models/address/custom_request_model';
import { CustomCityIataCodeHotelSearchRequest, mapCustomToCityIataCodeRequest } from './models/city_iata_code/custom_request_model';
import { CustomHotelCodeHotelSearchRequest, mapCustomToHotelCodeRequest } from './models/property/custom_request_model';
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
    console.log('searchParams', searchParams);
    return await TravelPortClient.searchHotels<CoordinatesResponse>(searchParams);
}

/**
 * Search hotels by airport IATA code
 */
/** @readonly */
export async function tpSearchHotelsByAirportIataCode(
    searchParams: CustomAirportIataCodeHotelSearchRequest
): Promise<AirportIataCodeResponse> {
    console.log('searchParams', searchParams);
    const transformedRequest = mapCustomToAirportIataCodeRequest(searchParams);
    console.log('transformedRequest', transformedRequest);
    return await TravelPortClient.searchHotels<AirportIataCodeResponse>(transformedRequest);
}

/**
 * Search hotels by property
 */
/** @readonly */
export async function tpSearchHotelsByProperty(
    searchParams: CustomHotelCodeHotelSearchRequest
): Promise<PropertyResponse> {
    console.log('searchParams', searchParams);
    const transformedRequest = mapCustomToHotelCodeRequest(searchParams);
    console.log('transformedRequest', transformedRequest);
    return await TravelPortClient.searchHotels<PropertyResponse>(transformedRequest);
}

/**
 * Search hotels by address
 */
/** @readonly */
export async function tpSearchHotelsByAddress(
    searchParams: CustomHotelSearchRequest
): Promise<AddressResponse> {
    const transformedRequest = mapCustomToAddressRequest(searchParams);
    console.log('transformedRequest', transformedRequest);
    return await TravelPortClient.searchHotels<AddressResponse>(transformedRequest);
}

/**
 * Search hotels by city IATA
 */
/** @readonly */
export async function tpSearchHotelsByCityIataCode(
    searchParams: CustomCityIataCodeHotelSearchRequest
): Promise<CityIataCodeResponse> {
    const transformedRequest = mapCustomToCityIataCodeRequest(searchParams);
    return await TravelPortClient.searchHotels<CityIataCodeResponse>(transformedRequest);
}