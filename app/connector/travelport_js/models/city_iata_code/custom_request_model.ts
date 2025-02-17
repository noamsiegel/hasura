import {
    StayDetails,
    Radius,
    BasePropertyFilter,
    BaseHotelSearchRequest
} from '../base_request';

export interface CityIataCodeDetails {
    iataCode: string;
}

export interface CityIataCodeType {
    type: "cityIATACode";
    details: CityIataCodeDetails;
    radius: Radius;
}

export interface CityIataCodeFilter extends BasePropertyFilter {
    location: CityIataCodeType;
}

export interface CityIataCodeHotelSearchRequest extends BaseHotelSearchRequest {
    propertyFilter: CityIataCodeFilter;
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
    // TODO: ask hasura why this isn't showing in the UI
    if (customRequest.search_radius && customRequest.search_radius.value > 25) {
        throw new Error('Search radius cannot be greater than 25');
    }
    const guests = {
        adults: customRequest.guests.adults,
        ...(customRequest.guests.children && {
            children: customRequest.guests.children
                ?.split(',')
                .map(age => ({ age: parseInt(age.trim()) }))
        })
    };

    const cityIataCodeFilter: CityIataCodeFilter = {
        location: {
            type: "cityIATACode",
            details: { iataCode: customRequest.iata_code },
            radius: customRequest.search_radius || { value: 5,unit: 'mi' }
        },
        returnOnlyAvailableProperties: customRequest.return_only_available ?? true,
        hotelNameContains: customRequest.hotel_name_contains
    };

    const stayDetails: StayDetails = {
        checkInDateLocal: customRequest.check_in_date,
        checkOutDateLocal: customRequest.check_out_date,
        rooms: customRequest.num_rooms,
        guests
    };

    return {
        propertyFilter: cityIataCodeFilter,
        stayDetails: stayDetails
    };
}