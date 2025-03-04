import {
    StayDetails,
    Radius,
} from '../base_request';

import {
    AddressHotelSearchRequest,
    AddressLocationDetails,
    AddressLocationType,
    AddressPropertyFilter
} from './request_model';

// TODO add accessibility boolean -- its not in the request schema



export interface CustomAddressHotelSearchRequest {
    // hotelIds?: string[];
    guests: {
        adults: number;
        children?: string; // comma separated list of ages
    };
    num_rooms: number;
    // currency: string;
    // guestNationality: string;

    check_in_date: string;
    check_out_date: string;

    // timeout?: number;
    // maxRatesPerHotel?: number;
    // boardType?: string;
    // refundable_rates_only?: boolean;

    // sort?: {
    //     field: string;
    //     order: 'asc' | 'desc';
    // }[];

    // roomMapping?: boolean;
    hotel_name_contains?: string;

    // address search
    country_code: string;
    state_province: string;
    city_name: string;

    // coordinate search
    // latitude?: number;
    // longitude?: number;

    // radius search
    search_radius?: Radius;

    // iata search
    // iataCode?: string;

    // limit search
    // limit?: number;
    // offset?: number;

    // ai search
    // aiSearch?: string;
    // minReviewsCount?: number;
    // minRating?: number;
    // zip?: string;
    // placeId?: string;
    // starRating?: number[];
    // hotelTypeIds?: number[];
    // chainIds?: number[];
    // facilities?: number[];
    // strictFacilityFiltering?: boolean;
    // stream?: boolean;
    // advancedAccessibilityOnly?: boolean;
    // weatherInfo?: boolean;
}

export function mapCustomToAddressRequest(customRequest: CustomAddressHotelSearchRequest): AddressHotelSearchRequest {
    const locationDetails: AddressLocationDetails = {
        type: "address",
        countryCode: customRequest.country_code,
        stateProvince: customRequest.state_province,
        cityName: customRequest.city_name
    };

    const location: AddressLocationType = {
        type: "address",
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

    const propertyFilter: AddressPropertyFilter = {
        location: location,
        returnOnlyAvailableProperties: true,
        // maxWaitTime: customRequest.timeout,
        // chainCodes: customRequest.chainIds?.map(String),
        hotelNameContains: customRequest.hotel_name_contains,
    };

    const addressRequest: AddressHotelSearchRequest = {
        propertyFilter: propertyFilter,
        stayDetails: stayDetails,
        // requestedCurrency: customRequest.currency,
    };

    return addressRequest;
}