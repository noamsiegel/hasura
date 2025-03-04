import {
    Radius,
    BasePropertyFilter,
    BaseHotelSearchRequest,
    StayDetails
} from '../base_request';

export interface CityIataCodeLocationDetails {
    iataCode: string;
}

export interface CityIataCodeLocationType {
    type: "cityIATACode";
    details: CityIataCodeLocationDetails;
    radius: Radius;
}

export interface CityIataCodeFilter extends BasePropertyFilter {
    location: CityIataCodeLocationType;
}

export interface CityIataCodeHotelSearchRequest extends BaseHotelSearchRequest {
    propertyFilter: CityIataCodeFilter
}

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
    return_only_available?: boolean;
}

export function mapCustomToCityIataCodeRequest(customRequest: CustomCityIataCodeHotelSearchRequest): CityIataCodeHotelSearchRequest {
    const guests = {
        adults: customRequest.guests.adults,
        ...(customRequest.guests.children && {
            children: customRequest.guests.children
                ?.split(',')
                .map(age => ({ age: parseInt(age.trim()) }))
        })
    };

    const cityIataCodePropertyFilter: CityIataCodeFilter = {
        location: {
            type: "cityIATACode",
            details: {
                iataCode: customRequest.iata_code,
            },
            radius: customRequest.search_radius || { value: 15, unit: "km" } // Default radius if not provided
        },
        returnOnlyAvailableProperties: customRequest.return_only_available ?? true,
        hotelNameContains: customRequest.hotel_name_contains
    };

    return {
        propertyFilter: cityIataCodePropertyFilter,
        stayDetails: {
            checkInDateLocal: customRequest.check_in_date,
            checkOutDateLocal: customRequest.check_out_date,
            rooms: customRequest.num_rooms,
            guests
        } as StayDetails,
    };
}