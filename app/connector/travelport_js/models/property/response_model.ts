// To parse this data:
//
//   import { Convert, PropertyResponse } from "./file";
//
//   const property = Convert.toPropertyResponse(json);

export interface PropertyResponse {
  hotelsResponse: HotelsResponse;
  pagination:     Pagination;
  traceId:        string;
  transactionId:  string;
  // [property: string]: any;
}

export interface HotelsResponse {
  checkInDateLocal:  Date;
  checkOutDateLocal: Date;
  propertyItems:     PropertyItem[];
  // [property: string]: any;
}

export interface PropertyItem {
  availability:               boolean;
  brandCode:                  string;
  chainCode:                  string;
  dataQualitySummaryScore:    DataQualitySummaryScore;
  longDescription:            string;
  lowestPrivateAvailableRate: LowestPrivateAvailableRate;
  lowestPublicAvailableRate:  LowestPublicAvailableRate;
  name:                       string;
  propertyCode:               string;
  propertyInfo:               PropertyInfo;
  roomTypes:                  RoomType[];
  // [property: string]: any;
}

export interface DataQualitySummaryScore {
  propertySummary: PropertySummary;
  // [property: string]: any;
}

export interface PropertySummary {
  averageAugmentedRateQualityScore: number;
  averageAugmentedRoomQualityScore: number;
  merchandisingQualityScore:        number;
  propertyContentQualityScore:      number;
  // [property: string]: any;
}

export interface LowestPrivateAvailableRate {
  averageNightlyBase:       LowestPrivateAvailableRateAverageNightlyBase;
  averageNightlyTotalPrice: LowestPrivateAvailableRateAverageNightlyTotalPrice;
  averageNightlyTotalTaxes: LowestPrivateAvailableRateAverageNightlyTotalTaxes;
  base:                     LowestPrivateAvailableRateBase;
  currencyCode:             string;
  rateCodeInfo:             LowestPrivateAvailableRateRateCodeInfo;
  rateKey:                  LowestPrivateAvailableRateRateKey;
  shortRoomDescription:     string;
  terms:                    LowestPrivateAvailableRateTerms;
  totalPrice:               LowestPrivateAvailableRateTotalPrice;
  totalTaxes:               LowestPrivateAvailableRateTotalTaxes;
  // [property: string]: any;
}

export interface LowestPrivateAvailableRateAverageNightlyBase {
  amount: number;
  // [property: string]: any;
}

export interface LowestPrivateAvailableRateAverageNightlyTotalPrice {
  amount: number;
  // [property: string]: any;
}

export interface LowestPrivateAvailableRateAverageNightlyTotalTaxes {
  amount: number;
  // [property: string]: any;
}

export interface LowestPrivateAvailableRateBase {
  amount: number;
  // [property: string]: any;
}

export interface LowestPrivateAvailableRateRateCodeInfo {
  rateCategory:           string;
  rateCategoryCode:       number;
  rateClassificationCode: number;
  rateType:               string;
  // [property: string]: any;
}

export interface LowestPrivateAvailableRateRateKey {
  authority: string;
  value:     string;
  // [property: string]: any;
}

export interface LowestPrivateAvailableRateTerms {
  cancelPenalties:                        PurpleCancelPenalty[];
  customerLoyaltyIDRequiredAtReservation: boolean;
  description:                            string[];
  guaranteeType:                          string;
  ratePaymentInfo:                        string;
  rateQualificationIDRequiredAtCheckIn:   boolean;
  refundable:                             boolean;
  // [property: string]: any;
}

export interface PurpleCancelPenalty {
  cancelShortDescription: string;
  deadlineLocal:          Date;
  penalty:                PurplePenalty;
  // [property: string]: any;
}

export interface PurplePenalty {
  currencyAmount:      PurpleCurrencyAmount;
  estimatedAmount:     boolean;
  originalPenaltyInfo: string;
  // [property: string]: any;
}

export interface PurpleCurrencyAmount {
  amount:   number;
  currency: string;
  // [property: string]: any;
}

export interface LowestPrivateAvailableRateTotalPrice {
  amount: number;
  // [property: string]: any;
}

export interface LowestPrivateAvailableRateTotalTaxes {
  amount: number;
  // [property: string]: any;
}

export interface LowestPublicAvailableRate {
  averageNightlyBase:       LowestPublicAvailableRateAverageNightlyBase;
  averageNightlyTotalPrice: LowestPublicAvailableRateAverageNightlyTotalPrice;
  averageNightlyTotalTaxes: LowestPublicAvailableRateAverageNightlyTotalTaxes;
  base:                     LowestPublicAvailableRateBase;
  currencyCode:             string;
  rateCodeInfo:             LowestPublicAvailableRateRateCodeInfo;
  rateKey:                  LowestPublicAvailableRateRateKey;
  shortRoomDescription:     string;
  terms:                    LowestPublicAvailableRateTerms;
  totalPrice:               LowestPublicAvailableRateTotalPrice;
  totalTaxes:               LowestPublicAvailableRateTotalTaxes;
  // [property: string]: any;
}

export interface LowestPublicAvailableRateAverageNightlyBase {
  amount: number;
  // [property: string]: any;
}

export interface LowestPublicAvailableRateAverageNightlyTotalPrice {
  amount: number;
  // [property: string]: any;
}

export interface LowestPublicAvailableRateAverageNightlyTotalTaxes {
  amount: number;
  // [property: string]: any;
}

export interface LowestPublicAvailableRateBase {
  amount: number;
  // [property: string]: any;
}

export interface LowestPublicAvailableRateRateCodeInfo {
  rateCategoryCode:       number;
  rateClassificationCode: number;
  rateType:               string;
  // [property: string]: any;
}

export interface LowestPublicAvailableRateRateKey {
  authority: string;
  value:     string;
  // [property: string]: any;
}

export interface LowestPublicAvailableRateTerms {
  cancelPenalties:                        FluffyCancelPenalty[];
  customerLoyaltyIDRequiredAtReservation: boolean;
  description:                            string[];
  guaranteeType:                          string;
  ratePaymentInfo:                        string;
  rateQualificationIDRequiredAtCheckIn:   boolean;
  refundable:                             boolean;
  // [property: string]: any;
}

export interface FluffyCancelPenalty {
  cancelShortDescription: string;
  deadlineLocal:          Date;
  penalty:                FluffyPenalty;
  // [property: string]: any;
}

export interface FluffyPenalty {
  currencyAmount:      FluffyCurrencyAmount;
  estimatedAmount:     boolean;
  originalPenaltyInfo: string;
  // [property: string]: any;
}

export interface FluffyCurrencyAmount {
  amount:   number;
  currency: string;
  // [property: string]: any;
}

export interface LowestPublicAvailableRateTotalPrice {
  amount: number;
  // [property: string]: any;
}

export interface LowestPublicAvailableRateTotalTaxes {
  amount: number;
  // [property: string]: any;
}

export interface PropertyInfo {
  adaCompliant:            boolean;
  address:                 Address;
  checkInTimeLocal:        string;
  distanceFromSearchPoint: DistanceFromSearchPoint;
  email:                   string;
  fax:                     Fax;
  featuredPropertyInd:     boolean;
  geolocation:             Geolocation;
  imageURLs:               ImageURL[];
  phone:                   Phone;
  ratings:                 Rating[];
  // [property: string]: any;
}

export interface Address {
  city:          string;
  countryCode:   string;
  postalCode:    string;
  stateProvince: string;
  street:        string;
  // [property: string]: any;
}

export interface DistanceFromSearchPoint {
  unitOfDistance: string;
  value:          number;
  // [property: string]: any;
}

export interface Fax {
  phoneNumber: string;
  // [property: string]: any;
}

export interface Geolocation {
  center: Center;
  // [property: string]: any;
}

export interface Center {
  latitude:  number;
  longitude: number;
  // [property: string]: any;
}

export interface ImageURL {
  caption:         string;
  curatedImage:    boolean;
  dimensions:      Dimensions;
  imageSize:       string;
  pictureCategory: number;
  url:             string;
  // [property: string]: any;
}

export interface Dimensions {
  height: number;
  width:  number;
  // [property: string]: any;
}

export interface Phone {
  phoneNumber: string;
  // [property: string]: any;
}

export interface Rating {
  provider: string;
  value:    number;
  // [property: string]: any;
}

export interface RoomType {
  bedTypes:                 RoomTypeBedType[];
  characteristics:          Characteristics;
  estimatedRoomTypeOTACode: number;
  maxOccupancy?:            number;
  rates:                    Rate[];
  roomAmenities:            RoomAmenity[];
  shortRoomDescription:     string;
  view?:                    RoomTypeView;
  // [property: string]: any;
}

export interface RoomTypeBedType {
  bedType:  string;
  quantity: number;
  size:     string;
  // [property: string]: any;
}

export interface Characteristics {
  accessible?:   boolean;
  bedTypes:      CharacteristicsBedType[];
  category:      Category;
  class?:        Class;
  maxOccupancy?: number;
  view?:         CharacteristicsView;
  // [property: string]: any;
}

export interface CharacteristicsBedType {
  bedType:  string;
  quantity: number;
  size:     string;
  // [property: string]: any;
}

export interface Category {
  code:        number;
  description: string;
  // [property: string]: any;
}

export interface Class {
  code:        number;
  description: string;
  // [property: string]: any;
}

export interface CharacteristicsView {
  code:        number;
  description: string;
  // [property: string]: any;
}

export interface Rate {
  accessibleRoom?:   boolean;
  bookingCode:       string;
  breakfastIncluded: boolean;
  dataQualityScore:  DataQualityScore;
  dinnerIncluded?:   boolean;
  lunchIncluded?:    boolean;
  nonSmoking:        boolean;
  price:             Price;
  quantity:          number;
  rateCodeInfo:      RateRateCodeInfo;
  rateDescription:   string;
  rateKey:           RateRateKey;
  roomDescription:   string;
  terms:             RateTerms;
  wifiIncluded?:     boolean;
  // [property: string]: any;
}

export interface DataQualityScore {
  augmentedRateQualityScore: number;
  augmentedRoomQualityScore: number;
  // [property: string]: any;
}

export interface Price {
  base:                      PriceBase;
  commission:                Commission;
  currencyCode:              string;
  nightlyRatesBreakdown:     NightlyRatesBreakdown[];
  perStayTaxAndFeeBreakdown: PerStayTaxAndFeeBreakdown;
  priceNote:                 PriceNote;
  taxesIncludedInBase:       boolean;
  totalPrice:                PriceTotalPrice;
  totalTaxes:                PriceTotalTaxes;
  // [property: string]: any;
}

export interface PriceBase {
  amount: number;
  // [property: string]: any;
}

export interface Commission {
  application:      boolean;
  estimatedPercent: boolean;
  percent:          number;
  // [property: string]: any;
}

export interface NightlyRatesBreakdown {
  localDate:  Date;
  totalPrice: NightlyRatesBreakdownTotalPrice;
  // [property: string]: any;
}

export interface NightlyRatesBreakdownTotalPrice {
  amount: number;
  // [property: string]: any;
}

export interface PerStayTaxAndFeeBreakdown {
  taxes: Tax[];
  // [property: string]: any;
}

export interface Tax {
  description: string;
  taxCode:     string;
  value:       Value;
  // [property: string]: any;
}

export interface Value {
  amount: number;
  // [property: string]: any;
}

export interface PriceNote {
  message: string;
  // [property: string]: any;
}

export interface PriceTotalPrice {
  amount: number;
  // [property: string]: any;
}

export interface PriceTotalTaxes {
  amount: number;
  // [property: string]: any;
}

export interface RateRateCodeInfo {
  rateCategory?:          string;
  rateCategoryCode:       number;
  rateClassificationCode: number;
  rateType:               string;
  // [property: string]: any;
}

export interface RateRateKey {
  authority: string;
  value:     string;
  // [property: string]: any;
}

export interface RateTerms {
  cancelPenalties:                         TentacledCancelPenalty[];
  customerLoyaltyIDRequiredAtReservation?: boolean;
  description:                             string[];
  guaranteeType:                           string;
  ratePaymentInfo:                         string;
  rateQualificationIDRequiredAtCheckIn?:   boolean;
  refundable:                              boolean;
  // [property: string]: any;
}

export interface TentacledCancelPenalty {
  cancelShortDescription: string;
  deadlineLocal:          Date;
  penalty:                TentacledPenalty;
  // [property: string]: any;
}

export interface TentacledPenalty {
  currencyAmount:      TentacledCurrencyAmount;
  estimatedAmount:     boolean;
  originalPenaltyInfo: string;
  // [property: string]: any;
}

export interface TentacledCurrencyAmount {
  amount:   number;
  currency: string;
  // [property: string]: any;
}

export interface RoomAmenity {
  code:        number;
  description: string;
  // [property: string]: any;
}

export interface RoomTypeView {
  code:        number;
  description: string;
  // [property: string]: any;
}

export interface Pagination {
  page:       number;
  pageSize:   number;
  totalItems: number;
  totalPages: number;
  // [property: string]: any;
}

// Converts JSON strings to/from your types
export class Convert {
  public static toPropertyResponse(json: string): PropertyResponse {
      return JSON.parse(json);
  }

  public static propertyToJson(value: PropertyResponse): string {
      return JSON.stringify(value);
  }
}
