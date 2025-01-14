from typing import List, Optional
from pydantic import BaseModel
from typing import List, Optional, Union

class Guest(BaseModel):
    adults: int
    children: Optional[List['Child']] = None

class Child(BaseModel):
    age: int

class StayDetails(BaseModel):
    checkInDateLocal: str
    checkOutDateLocal: str
    rooms: int
    guests: Guest

""" Location Details """

class LocationDetails(BaseModel):
    iataCode: str

class Radius(BaseModel):
    value: int
    unit: str


class AirportLocation(BaseModel):
    iataCode: str
    radius: Radius

class CoordinatesLocation(BaseModel):
    latitude: str
    longitude: str
    radius: Radius

class AddressLocation(BaseModel):
    countryCode: str
    stateProvince: str
    cityName: str
    radius: Radius

class CityLocation(BaseModel):
    iataCode: str
    radius: Radius

class LocationType(BaseModel):
    type: str
    details: Union[AirportLocation, CoordinatesLocation, AddressLocation, CityLocation]
    radius: Radius

""" Cont """

class NegotiatedRates(BaseModel):
    rateCodes: List[str]
    masterRateCode: str

class CustomerLoyaltyCard(BaseModel):
    value: str
    supplierCode: str
    supplierType: str

class PropertyFilter(BaseModel):
    location: LocationType
    returnOnlyAvailableProperties: bool
    maxWaitTime: Optional[int] = None
    chainCodes: Optional[List[str]] = None
    hotelNameContains: Optional[str] = None
    negotiatedRates: Optional[NegotiatedRates] = None
    customerLoyaltyCards: Optional[List[CustomerLoyaltyCard]] = None
    imageSize: Optional[str] = None
    returnAllImageURLs: Optional[bool] = None
    recommendedPropertyAmenitiesInd: Optional[bool] = None
    amenityCategories: Optional[List[str]] = None

class AirportPropertyFilter(BaseModel):
    location: AirportLocation
    returnOnlyAvailableProperties: bool
    maxWaitTime: Optional[int] = None
    chainCodes: Optional[List[str]] = None
    hotelNameContains: Optional[str] = None
    negotiatedRates: Optional[NegotiatedRates] = None
    customerLoyaltyCards: Optional[List[CustomerLoyaltyCard]] = None
    imageSize: Optional[str] = None
    returnAllImageURLs: Optional[bool] = None
    recommendedPropertyAmenitiesInd: Optional[bool] = None
    amenityCategories: Optional[List[str]] = None

class CoordinatesPropertyFilter(PropertyFilter):
    location: CoordinatesLocation

class AddressPropertyFilter(PropertyFilter):
    location: AddressLocation

class CityPropertyFilter(PropertyFilter):
    location: CityLocation

class BedConfiguration(BaseModel):
    minimumQuantity: int
    type: str

class AmenityCode(BaseModel):
    code: int

class RoomFilter(BaseModel):
    nonSmoking: Optional[bool] = None
    balcony: Optional[bool] = None
    accessible: Optional[bool] = None
    connecting: Optional[bool] = None
    family: Optional[bool] = None
    highFloor: Optional[bool] = None
    maxOccupancy: Optional[int] = None
    bedConfiguration: Optional[BedConfiguration] = None
    amenityCodes: Optional[List[int]] = None
    recommendedRoomAmenitiesInd: Optional[bool] = None

class RateFlags(BaseModel):
    refundable: Optional[bool] = None
    commissionable: Optional[bool] = None
    deposit: Optional[bool] = None
    prepay: Optional[bool] = None
    postpay: Optional[bool] = None
    breakfast: Optional[bool] = None
    lunch: Optional[bool] = None
    dinner: Optional[bool] = None

class RateFilter(BaseModel):
    rateFlags: Optional[RateFlags] = None
    removeSpecialRates: Optional[bool] = None
    categories: Optional[List[str]] = None


# HOTEL SEARCH REQUESTS
class HotelSearchRequest(BaseModel):
    stayDetails: StayDetails
    propertyFilter: PropertyFilter
    responseFields: Optional[List[str]] = None
    requestedCurrency: Optional[str] = None
    roomFilter: Optional[RoomFilter] = None
    rateFilter: Optional[RateFilter] = None

class AirportHotelSearchRequest(BaseModel):
    stayDetails: StayDetails
    propertyFilter: AirportPropertyFilter
    responseFields: Optional[List[str]] = None
    requestedCurrency: Optional[str] = None
    roomFilter: Optional[RoomFilter] = None
    rateFilter: Optional[RateFilter] = None

class CoordinatesHotelSearchRequest(HotelSearchRequest):
    propertyFilter: CoordinatesPropertyFilter

class AddressHotelSearchRequest(HotelSearchRequest):
    propertyFilter: AddressPropertyFilter

class CityHotelSearchRequest(HotelSearchRequest):
    propertyFilter: CityPropertyFilter