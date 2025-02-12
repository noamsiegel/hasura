import {
    CityIataCodeHotelSearchRequest,
    CityIataCodeLocationDetails,
    CityIataCodeLocationType,
    CityIataCodePropertyFilter
} from './request_model';

import {
    StayDetails,
    Radius,
} from '../base_request';



export interface CustomCityIataCodeHotelSearchRequest {
    guests: {
        adults: number;
        children?: string; // comma separated list of ages
    };
    num_rooms: number;
    check_in_date: string;
    check_out_date: string;
    iata_code: string;
    search_radius?: Radius;
    hotel_name_contains?: string;
}

export function mapCustomToCityIataCodeRequest(customRequest: CustomCityIataCodeHotelSearchRequest): CityIataCodeHotelSearchRequest {
    const locationDetails: CityIataCodeLocationDetails = {
        type: "cityIATACode",
        iataCode: customRequest.iata_code
    };

    const location: CityIataCodeLocationType = {
        type: "cityIATACode",
        details: locationDetails,
        radius: {
            value: customRequest.search_radius?.value || 5,
            unit: customRequest.search_radius?.unit || 'mi'
        }
    };

    const stayDetails: StayDetails = {
        checkInDateLocal: customRequest.check_in_date,
        checkOutDateLocal: customRequest.check_out_date,
        rooms: customRequest.num_rooms,
        guests: {
            adults: customRequest.guests.adults,
            children: customRequest.guests.children
                ?.split(',')
                .map(age => ({ age: parseInt(age.trim()) }))
        }
    };

    const propertyFilter: CityIataCodePropertyFilter = {
        location: location,
        returnOnlyAvailableProperties: true,
        hotelNameContains: customRequest.hotel_name_contains,
    };

    const cityIataCodeRequest: CityIataCodeHotelSearchRequest = {
        propertyFilter: propertyFilter,
        stayDetails: stayDetails
    };

    return cityIataCodeRequest;
}