import {
    Radius,
    BasePropertyFilter,
    BaseHotelSearchRequest,
    StayDetails
} from '../base_request';

interface CoordinatesLocationDetails {
    latitude: string;
    longitude: string;
}

interface CoordinatesLocationType {
    type: "coordinates";
    details: CoordinatesLocationDetails;
    radius: Radius;
}

export interface CoordinatesPropertyFilter extends BasePropertyFilter {
    location: CoordinatesLocationType;
}

export interface CoordinatesHotelSearchRequest extends BaseHotelSearchRequest {
    propertyFilter: CoordinatesPropertyFilter;
}



export interface CustomCoordinatesHotelSearchRequest {
    guests: {
        adults: number;
        children?: string; // comma separated list of ages
    };
    num_rooms: number;
    check_in_date: string;
    check_out_date: string;
    latitude: string;
    longitude: string;
    search_radius?: Radius;
    hotel_name_contains?: string;
    return_only_available?: boolean;
}

export function mapCustomToCoordinatesRequest(customRequest: CustomCoordinatesHotelSearchRequest): CoordinatesHotelSearchRequest {
    const guests = {
        adults: customRequest.guests.adults,
        ...(customRequest.guests.children && {
            children: customRequest.guests.children
                ?.split(',')
                .map(age => ({ age: parseInt(age.trim()) }))
        })
    };

    const coordinatesPropertyFilter: CoordinatesPropertyFilter = {
        location: {
            type: "coordinates",
            details: {
                latitude: customRequest.latitude,
                longitude: customRequest.longitude
            },
            radius: customRequest.search_radius || { value: 15, unit: "km" } // Default radius if not provided
        },
        returnOnlyAvailableProperties: customRequest.return_only_available ?? true,
        hotelNameContains: customRequest.hotel_name_contains
    };

    return {
        propertyFilter: coordinatesPropertyFilter,
        stayDetails: {
            checkInDateLocal: customRequest.check_in_date,
            checkOutDateLocal: customRequest.check_out_date,
            rooms: customRequest.num_rooms,
            guests
        } as StayDetails,
    };
}
