// requests
import { CustomCoordinatesHotelSearchRequest,mapCustomToCoordinatesRequest } from './models/coordinates/request_model';
import { CustomAirportIataCodeHotelSearchRequest,mapCustomToAirportIataCodeRequest } from './models/airport_iata_code/request_model';
import { CustomAddressHotelSearchRequest,mapCustomToAddressRequest } from './models/address/request_model';
import { CustomCityIataCodeHotelSearchRequest,mapCustomToCityIataCodeRequest } from './models/city_iata_code/request_model';
import { CustomHotelCodeHotelSearchRequest,mapCustomToHotelCodeRequest } from './models/property/request_model';
// responses
import { TravelportResponse } from './models/base_response';
import { mapTravelportToCustomResponse } from './models/custom_response_mapper';
import { CustomResponse } from './models/custom_response';
// weather
import { getWeatherData as fetchWeatherData } from './weather/main';
import { WeatherDataParams,WeatherDataResponse } from './weather/types';

// Travelport client
import { TravelPortClient } from './client';

// Hasura SDK
import * as sdk from "@hasura/ndc-lambda-sdk";

// TODO make business logic make sure that checkin and checkout dates are valid (on or after today)

/* Search hotels by coordinates */
/** @readonly */
export async function tpSearchHotelsByCoordinates(
    searchParams: CustomCoordinatesHotelSearchRequest
): Promise<CustomResponse> {
    if (searchParams.search_radius?.value && searchParams.search_radius.value > 25) {
        throw new sdk.UnprocessableContent("Search radius cannot be greater than 25",{
            search_radius: searchParams.search_radius.value
        });
    }
    const transformedRequest = mapCustomToCoordinatesRequest(searchParams);
    const travelportResponse = await TravelPortClient.searchHotels<TravelportResponse>(transformedRequest);
    return mapTravelportToCustomResponse(travelportResponse);
}

/* Search hotels by airport IATA code */
/** @readonly */
export async function tpSearchHotelsByAirportIataCode(
    searchParams: CustomAirportIataCodeHotelSearchRequest
): Promise<CustomResponse> {
    const transformedRequest = mapCustomToAirportIataCodeRequest(searchParams);
    const travelportResponse = await TravelPortClient.searchHotels<TravelportResponse>(transformedRequest);
    return mapTravelportToCustomResponse(travelportResponse);
}

/* Search hotels by property */
// TODO fix response mapping, roomTypes are not being mapped correctly
/** @readonly */
export async function tpSearchHotelsByProperty(
    searchParams: CustomHotelCodeHotelSearchRequest
): Promise<CustomResponse> {
    const transformedRequest = mapCustomToHotelCodeRequest(searchParams);
    const travelportResponse = await TravelPortClient.searchHotels<TravelportResponse>(transformedRequest);
    return mapTravelportToCustomResponse(travelportResponse);
}

/* Search hotels by address */
/** @readonly */
export async function tpSearchHotelsByAddress(
    searchParams: CustomAddressHotelSearchRequest
): Promise<CustomResponse> {
    const transformedRequest = mapCustomToAddressRequest(searchParams);
    const travelportResponse = await TravelPortClient.searchHotels<TravelportResponse>(transformedRequest);
    return mapTravelportToCustomResponse(travelportResponse);
}

/* Search hotels by city IATA */
/** @readonly */
export async function tpSearchHotelsByCityIataCode(
    searchParams: CustomCityIataCodeHotelSearchRequest
): Promise<CustomResponse> {
    const transformedRequest = mapCustomToCityIataCodeRequest(searchParams);
    const travelportResponse = await TravelPortClient.searchHotels<TravelportResponse>(transformedRequest);
    return mapTravelportToCustomResponse(travelportResponse);
}

/* Get weather data for a location */
/** @readonly */
export async function getWeatherData(
    searchParams: WeatherDataParams
): Promise<WeatherDataResponse> {
    return await fetchWeatherData(searchParams);
}