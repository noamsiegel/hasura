import {
    Radius,
    BasePropertyFilter,
    BaseHotelSearchRequest,
    StayDetails
} from '../base_request';

interface AirportIataCodeLocationDetails {
    iataCode: string;
}

interface AirportIataCodeLocationType {
    type: "airportIATACode";
    details: AirportIataCodeLocationDetails;
    radius: Radius;
}

export interface AirportIataCodePropertyFilter extends BasePropertyFilter {
    location: AirportIataCodeLocationType;
}

export interface AirportIataCodeHotelSearchRequest extends BaseHotelSearchRequest {
    propertyFilter: AirportIataCodePropertyFilter;
}

export interface CustomAirportIataCodeHotelSearchRequest {
    guests: {
        adults: number;
        children?: string; // comma separated list of ages
    };
    num_rooms: number;
    check_in_date: string;
    check_out_date: string;
    airport_iata_code: string;
    search_radius?: Radius;
    hotel_name_contains?: string;
    return_only_available?: boolean;
}

export function mapCustomToAirportIataCodeRequest(customRequest: CustomAirportIataCodeHotelSearchRequest): AirportIataCodeHotelSearchRequest {
    const guests = {
        adults: customRequest.guests.adults,
        ...(customRequest.guests.children && {
            children: customRequest.guests.children
                ?.split(',')
                .map(age => ({ age: parseInt(age.trim()) }))
        })
    };

    const airportIataCodePropertyFilter: AirportIataCodePropertyFilter = {
        location: {
            type: "airportIATACode",
            details: {
                iataCode: customRequest.airport_iata_code
            },
            radius: customRequest.search_radius || { value: 25, unit: "km" } // Default radius if not provided
        },
        returnOnlyAvailableProperties: customRequest.return_only_available ?? true,
        hotelNameContains: customRequest.hotel_name_contains
    };

    return {
        propertyFilter: airportIataCodePropertyFilter,
        stayDetails: {
            checkInDateLocal: customRequest.check_in_date,
            checkOutDateLocal: customRequest.check_out_date,
            rooms: customRequest.num_rooms,
            guests
        } as StayDetails,
    };
}
