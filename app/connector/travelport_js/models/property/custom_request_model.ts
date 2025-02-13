import {
    PropertyHotelSearchRequest,
    PropertyFilter,
    PropertyDetails
} from './request_model';

import {
    StayDetails,
    Radius,
} from '../base_request';



export interface CustomHotelCodeHotelSearchRequest {
    guests: {
        adults: number;
        children?: string; // comma separated list of ages
    };
    num_rooms: number;
    check_in_date: string;
    check_out_date: string;
    hotels: PropertyDetails[];
    search_radius?: Radius;
    hotel_name_contains?: string;
}

export function mapCustomToHotelCodeRequest(customRequest: CustomHotelCodeHotelSearchRequest): PropertyHotelSearchRequest{
    const guests = {
        adults: customRequest.guests.adults,
        ...(customRequest.guests.children && {
            children: customRequest.guests.children
                ?.split(',')
                .map(age => ({ age: parseInt(age.trim()) }))
        })
    };

    const hotelCodePropertyFilter: PropertyFilter = {
        propertyKeys: customRequest.hotels,
        hotelNameContains: customRequest.hotel_name_contains,
    };

    return {
        stayDetails: {
            checkInDateLocal: customRequest.check_in_date,
            checkOutDateLocal: customRequest.check_out_date,
            rooms: customRequest.num_rooms,
            guests
        },
        propertyFilter: hotelCodePropertyFilter
    };
}