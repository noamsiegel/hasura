import {
    StayDetails,
    Radius,
    BasePropertyFilter,
    BaseHotelSearchRequest,
} from '../base_request';


export interface PropertyDetails {
    chainCode: string;
    propertyCode: string;
}

// Note: Property search is slightly different as it uses propertyKeys instead of location
export interface PropertyFilter extends BasePropertyFilter {
    propertyKeys: PropertyDetails[];
}

export interface PropertyHotelSearchRequest extends BaseHotelSearchRequest {
    propertyFilter: PropertyFilter;
}


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
        } as StayDetails,
        propertyFilter: hotelCodePropertyFilter
    };
}