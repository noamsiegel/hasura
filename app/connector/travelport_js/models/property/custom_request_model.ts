import {
    HotelCodeHotelSearchRequest,
    HotelCodePropertyFilter
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
    hotels: {
        chainCode: string;
        propertyCode: string;
    }[];
    search_radius?: Radius;
    hotel_name_contains?: string;
}

export function mapCustomToHotelCodeRequest(customRequest: CustomHotelCodeHotelSearchRequest): HotelCodeHotelSearchRequest {
    const guests = {
        adults: customRequest.guests.adults,
        ...(customRequest.guests.children && {
            children: customRequest.guests.children
                ?.split(',')
                .map(age => ({ age: parseInt(age.trim()) }))
        })
    };

    // Transform hotels array into propertyKeys format
    const propertyKeys = customRequest.hotels.map(hotel => ({
        chainCode: hotel.chainCode,
        propertyCode: hotel.propertyCode
    }));

    const hotelCodePropertyFilter: HotelCodePropertyFilter = {
        propertyKeys,
        returnOnlyAvailableProperties: true,
        hotelNameContains: customRequest.hotel_name_contains,
    };

    return {
        propertyFilter: hotelCodePropertyFilter,
        stayDetails: {
            checkInDateLocal: customRequest.check_in_date,
            checkOutDateLocal: customRequest.check_out_date,
            rooms: customRequest.num_rooms,
            guests
        }
    };
}