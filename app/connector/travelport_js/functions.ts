// requests
import { CustomCoordinatesHotelSearchRequest, mapCustomToCoordinatesRequest } from './models/coordinates/request_model';
import { CustomAirportIataCodeHotelSearchRequest, mapCustomToAirportIataCodeRequest } from './models/airport_iata_code/request_model';
import { CustomHotelSearchRequest, mapCustomToAddressRequest } from './models/address/custom_request_model';
import { CustomCityIataCodeHotelSearchRequest, mapCustomToCityIataCodeRequest } from './models/city_iata_code/custom_request_model';
import { CustomHotelCodeHotelSearchRequest, mapCustomToHotelCodeRequest } from './models/property/request_model';
// responses
import { TravelportResponse } from './models/base_response';
import { TravelPortClient } from './client';
// import { mapTravelportToCustomResponse } from './models/response_mapper';
// import { CustomResponse } from './models/custom_response';
// Hasura SDK
import * as sdk from "@hasura/ndc-lambda-sdk";

// TODO make business logic make sure that checkin and checkout dates are valid (on or after today)

/**
 * Search hotels by coordinates
 */
/** @readonly */
export async function tpSearchHotelsByCoordinates(
    searchParams: CustomCoordinatesHotelSearchRequest
): Promise<TravelportResponse> {
    if (searchParams.search_radius?.value && searchParams.search_radius.value > 25) {
        throw new sdk.UnprocessableContent("Search radius cannot be greater than 25", {
            search_radius: searchParams.search_radius.value
        });
    }
    const transformedRequest = mapCustomToCoordinatesRequest(searchParams);
    return await TravelPortClient.searchHotels<TravelportResponse>(transformedRequest);
    // const travelportResponse = await TravelPortClient.searchHotels<TravelportResponse>(transformedRequest);
    // return mapTravelportToCustomResponse(travelportResponse);
}

/**
 * Search hotels by airport IATA code
 */
/** @readonly */
export async function tpSearchHotelsByAirportIataCode(
    searchParams: CustomAirportIataCodeHotelSearchRequest
): Promise<TravelportResponse> {
    const transformedRequest = mapCustomToAirportIataCodeRequest(searchParams);
    return await TravelPortClient.searchHotels<TravelportResponse>(transformedRequest);
}

/**
 * Search hotels by property
 */
/** @readonly */
export async function tpSearchHotelsByProperty(
    searchParams: CustomHotelCodeHotelSearchRequest
): Promise<TravelportResponse> {
    const transformedRequest = mapCustomToHotelCodeRequest(searchParams);
    return await TravelPortClient.searchHotels<TravelportResponse>(transformedRequest);
}

/**
 * Search hotels by address
 */
/** @readonly */
export async function tpSearchHotelsByAddress(
    searchParams: CustomHotelSearchRequest
): Promise<TravelportResponse> {
    const transformedRequest = mapCustomToAddressRequest(searchParams);
    return await TravelPortClient.searchHotels<TravelportResponse>(transformedRequest);
}

/**
 * Search hotels by city IATA
 */
/** @readonly */
export async function tpSearchHotelsByCityIataCode(
    searchParams: CustomCityIataCodeHotelSearchRequest
): Promise<TravelportResponse> {
    const transformedRequest = mapCustomToCityIataCodeRequest(searchParams);
    return await TravelPortClient.searchHotels<TravelportResponse>(transformedRequest);
}