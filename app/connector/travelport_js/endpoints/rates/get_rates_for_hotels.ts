import { CoordinatesHotelSearchRequest } from '../../models/coordinates/request_model';
import { CityIataCodeHotelSearchRequest } from '../../models/city_iata_code/request_model';
import { AddressHotelSearchRequest } from '../../models/address/request_model';
import { AirportIataCodeHotelSearchRequest } from '../../models/airport_iata_code/request_model';
import { PropertyHotelSearchRequest } from '../../models/property/request_model';

// NOTE so I can't use unions? wtf?
export type HotelSearchRequest =
    | CoordinatesHotelSearchRequest
    | CityIataCodeHotelSearchRequest
    | AddressHotelSearchRequest
    | AirportIataCodeHotelSearchRequest
    | PropertyHotelSearchRequest;

function getRatesForHotels(request: HotelSearchRequest) {
    // TypeScript will know that request will be one of the five types
    // You can use type narrowing to determine which specific type it is
    if ('propertyFilter' in request && 'location' in request.propertyFilter) {
        const location = request.propertyFilter.location;
        switch (location.type) {
            case 'coordinates': // Handle coordinates search
            case 'cityIATACode': // Handle city search
            case 'address': // Handle address search
            case 'airportIATACode': // Handle airport search
        }
    } else {
        // Handle property search
    }
}