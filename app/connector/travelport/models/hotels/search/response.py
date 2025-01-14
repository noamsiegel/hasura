from typing import List, Optional
from datetime import date, datetime
from decimal import Decimal
from uuid import UUID
from pydantic import BaseModel, Field, HttpUrl

class Center(BaseModel):
    latitude: float = Field(...)
    longitude: float = Field(...)

class Geolocation(BaseModel):
    center: Center = Field(...)

class DistanceFromSearchPoint(BaseModel):
    unit_of_distance: str = Field(..., alias="unitOfDistance")
    value: float = Field(...)

class Address(BaseModel):
    street: str = Field(...)
    city: str = Field(...)
    country_code: str = Field(..., alias="countryCode")
    postal_code: str = Field(..., alias="postalCode")
    state_province: Optional[str] = Field(None, alias="stateProvince")

class Rating(BaseModel):
    value: int = Field(...)
    provider: str = Field(...)

class Amenity(BaseModel):
    description: str = Field(...)
    code: int = Field(...)
    category: str = Field(...)

class Phone(BaseModel):
    phone_number: str = Field(..., alias="phoneNumber")

class ImageURL(BaseModel):
    curated_image: bool = Field(..., alias="curatedImage")
    image_size: str = Field(..., alias="imageSize")
    caption: str
    picture_category: int = Field(..., alias="pictureCategory")
    url: HttpUrl

class PropertyInfo(BaseModel):
    geolocation: Geolocation = Field(...)
    distance_from_search_point: DistanceFromSearchPoint = Field(..., alias="distanceFromSearchPoint")
    address: Address = Field(...)
    ada_compliant: bool = Field(..., alias="adaCompliant")
    featured_property_ind: bool = Field(..., alias="featuredPropertyInd")
    ratings: Optional[List[Rating]] = None
    amenities: Optional[List[Amenity]] = None
    email: Optional[str] = None
    phone: Optional[Phone] = None
    fax: Optional[Phone] = None
    check_out_time_local: Optional[str] = Field(None, alias="checkOutTimeLocal")
    image_urls: Optional[List[ImageURL]] = Field(None, alias="imageURLs")
    accepted_credit_cards: Optional[List[str]] = Field(None, alias="acceptedCreditCards")
    check_in_time_local: Optional[str] = Field(None, alias="checkInTimeLocal")

class PropertySummary(BaseModel):
    merchandising_quality_score: int = Field(..., alias="merchandisingQualityScore")
    property_content_quality_score: int = Field(..., alias="propertyContentQualityScore")
    average_augmented_rate_quality_score: int = Field(..., alias="averageAugmentedRateQualityScore")
    average_augmented_room_quality_score: int = Field(..., alias="averageAugmentedRoomQualityScore")

class DataQualitySummaryScore(BaseModel):
    property_summary: PropertySummary = Field(..., alias="propertySummary")

class CategoryCode(BaseModel):
    code: Optional[int] = None
    description: str

class BedType(BaseModel):
    bed_type: str = Field(..., alias="bedType")
    quantity: int
    size: str

class LocationInfo(BaseModel):
    floor: Optional[str] = None
    proximity: Optional[str] = None

class Characteristics(BaseModel):
    category: CategoryCode
    bed_types: List[BedType] = Field(..., alias="bedTypes")
    max_occupancy: Optional[int] = Field(None, alias="maxOccupancy")
    view: Optional[CategoryCode] = None
    accessible: Optional[bool] = None
    other_features: Optional[List[str]] = Field(None, alias="otherFeatures")
    class_: Optional[CategoryCode] = Field(None, alias="class")
    balcony_type: Optional[CategoryCode] = Field(None, alias="balconyType")
    number_of_bedrooms: Optional[int] = Field(None, alias="numberOfBedrooms")
    location_info: Optional[LocationInfo] = Field(None, alias="locationInfo")
    number_of_bathrooms: Optional[int] = Field(None, alias="numberOfBathrooms")

class RateKey(BaseModel):
    value: str
    authority: str

class RateCodeInfo(BaseModel):
    rate_category_code: int = Field(..., alias="rateCategoryCode")
    rate_type: str = Field(..., alias="rateType")
    rate_classification_code: int = Field(..., alias="rateClassificationCode")
    rate_category: Optional[str] = Field(None, alias="rateCategory")
    rate_code: Optional[str] = Field(None, alias="rateCode")

class DataQualityScore(BaseModel):
    augmented_rate_quality_score: int = Field(..., alias="augmentedRateQualityScore")
    augmented_room_quality_score: int = Field(..., alias="augmentedRoomQualityScore")

class Amount(BaseModel):
    amount: Decimal

class CurrencyAmount(BaseModel):
    amount: Decimal
    currency: str

class Commission(BaseModel):
    application: bool
    percent: Optional[int] = None
    estimated_percent: Optional[bool] = Field(None, alias="estimatedPercent")

class TaxFee(BaseModel):
    value: Amount
    tax_code: str = Field(..., alias="taxCode")
    description: str

class Fee(BaseModel):
    value: CurrencyAmount
    tax_code: str = Field(..., alias="taxCode")
    description: str
    purpose: str

class TaxAndFeeBreakdown(BaseModel):
    taxes: List[TaxFee]
    fees: Optional[List[Fee]] = None

class NightlyRate(BaseModel):
    total_price: Amount = Field(..., alias="totalPrice")
    local_date: date = Field(..., alias="localDate")

class PriceNote(BaseModel):
    message: str

class Price(BaseModel):
    currency_code: str = Field(..., alias="currencyCode")
    base: Amount
    total_taxes: Amount = Field(..., alias="totalTaxes")
    total_price: Amount = Field(..., alias="totalPrice")
    taxes_included_in_base: bool = Field(..., alias="taxesIncludedInBase")
    commission: Commission
    per_stay_tax_and_fee_breakdown: TaxAndFeeBreakdown = Field(..., alias="perStayTaxAndFeeBreakdown")
    nightly_rates_breakdown: List[NightlyRate] = Field(..., alias="nightlyRatesBreakdown")
    price_note: PriceNote = Field(..., alias="priceNote")

class Penalty(BaseModel):
    estimated_amount: bool = Field(..., alias="estimatedAmount")
    currency_amount: CurrencyAmount = Field(..., alias="currencyAmount")
    original_penalty_info: str = Field(..., alias="originalPenaltyInfo")

class PenaltyNote(BaseModel):
    message: str

class CancelPenalty(BaseModel):
    deadline_local: datetime = Field(..., alias="deadlineLocal")
    cancel_short_description: str = Field(..., alias="cancelShortDescription")
    penalty: Penalty
    estimated_deadline_local: Optional[bool] = Field(None, alias="estimatedDeadlineLocal")
    penalty_notes: Optional[List[PenaltyNote]] = Field(None, alias="penaltyNotes")

class Terms(BaseModel):
    guarantee_type: str = Field(..., alias="guaranteeType")
    cancel_penalties: List[CancelPenalty] = Field(..., alias="cancelPenalties")
    description: List[str]
    customer_loyalty_id_required_at_reservation: Optional[bool] = Field(None, alias="customerLoyaltyIDRequiredAtReservation")
    rate_qualification_id_required_at_check_in: Optional[bool] = Field(None, alias="rateQualificationIDRequiredAtCheckIn")
    rate_payment_info: Optional[str] = Field(None, alias="ratePaymentInfo")
    refundable: Optional[bool] = None
    cancel_note: Optional[str] = Field(None, alias="cancelNote")

class Rate(BaseModel):
    rate_key: RateKey = Field(..., alias="rateKey")
    booking_code: str = Field(..., alias="bookingCode")
    rate_description: str = Field(..., alias="rateDescription")
    room_description: str = Field(..., alias="roomDescription")
    rate_code_info: RateCodeInfo = Field(..., alias="rateCodeInfo")
    data_quality_score: DataQualityScore = Field(..., alias="dataQualityScore")
    non_smoking: bool = Field(..., alias="nonSmoking")
    price: Price = Field(...)
    terms: Terms = Field(...)
    wifi_included: Optional[bool] = Field(None, alias="wifiIncluded")
    accessible_room: Optional[bool] = Field(None, alias="accessibleRoom")
    quantity: Optional[int] = None
    breakfast_included: Optional[bool] = Field(None, alias="breakfastIncluded")
    lunch_included: Optional[bool] = Field(None, alias="lunchIncluded")
    dinner_included: Optional[bool] = Field(None, alias="dinnerIncluded")

class RoomAmenity(BaseModel):
    description: str
    code: int

class RoomType(BaseModel):
    estimated_room_type_ota_code: int = Field(..., alias="estimatedRoomTypeOTACode")
    short_room_description: str = Field(..., alias="shortRoomDescription")
    characteristics: Characteristics
    bed_types: List[BedType] = Field(..., alias="bedTypes")
    rates: List[Rate]
    max_occupancy: Optional[int] = Field(None, alias="maxOccupancy")
    view: Optional[CategoryCode] = None
    room_amenities: Optional[List[RoomAmenity]] = Field(None, alias="roomAmenities")
    room_image_urls: Optional[List[ImageURL]] = Field(None, alias="roomImageURLs")

class LowestRate(BaseModel):
    total_price: Amount = Field(..., alias="totalPrice")
    base: Amount
    total_taxes: Amount = Field(..., alias="totalTaxes")
    average_nightly_total_price: Amount = Field(..., alias="averageNightlyTotalPrice")
    average_nightly_base: Amount = Field(..., alias="averageNightlyBase")
    average_nightly_total_taxes: Amount = Field(..., alias="averageNightlyTotalTaxes")
    currency_code: str = Field(..., alias="currencyCode")
    rate_key: RateKey = Field(..., alias="rateKey")
    rate_code_info: RateCodeInfo = Field(..., alias="rateCodeInfo")
    short_room_description: str = Field(..., alias="shortRoomDescription")
    terms: Terms

class PropertyItem(BaseModel):
    name: str
    chain_code: str = Field(..., alias="chainCode")
    property_code: str = Field(..., alias="propertyCode")
    data_quality_summary_score: Optional[DataQualitySummaryScore] = Field(None, alias="dataQualitySummaryScore")
    availability: bool
    property_info: PropertyInfo = Field(..., alias="propertyInfo")
    room_types: Optional[List[RoomType]] = Field(None, alias="roomTypes")
    brand_code: Optional[str] = Field(None, alias="brandCode")
    lowest_private_available_rate: Optional[LowestRate] = Field(None, alias="lowestPrivateAvailableRate")
    long_description: Optional[str] = Field(None, alias="longDescription")
    lowest_public_available_rate: Optional[LowestRate] = Field(None, alias="lowestPublicAvailableRate")

class SearchPoint(BaseModel):
    latitude: float
    longitude: float

class Pagination(BaseModel):
    page: int
    page_size: int = Field(..., alias="pageSize")
    total_pages: int = Field(..., alias="totalPages")
    total_items: int = Field(..., alias="totalItems")
    pagination_token: UUID = Field(..., alias="paginationToken")

class HotelsResponse(BaseModel):
    search_point: SearchPoint = Field(..., alias="searchPoint")
    check_in_date_local: date = Field(..., alias="checkInDateLocal")
    check_out_date_local: date = Field(..., alias="checkOutDateLocal")
    property_items: List[PropertyItem] = Field(..., alias="propertyItems")

class SearchHotelsResponse(BaseModel):
    trace_id: UUID = Field(..., alias="traceId")
    transaction_id: UUID = Field(..., alias="transactionId")
    pagination: Optional[Pagination] = None
    hotels_response: Optional[HotelsResponse] = Field(None, alias="hotelsResponse")

    # # Add model configuration to match JSON schema validation
    # model_config = {
    #     "json_schema_extra": {
    #         "required": ["searchHotels"],
    #         "type": "object"
    #     }
    # }