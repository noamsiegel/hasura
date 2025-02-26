export interface CustomResponse {
    data: HotelData[]
    guestLevel: number
    // sandbox: boolean
}

export interface HotelData {
    hotelId: string
    roomTypes: RoomType[]
}

export interface RoomType {
    roomTypeId: string
    offerId: string
    supplier: string
    supplierId: number
    rates: Rate[]
    offerRetailRate: OfferRetailRate
    suggestedSellingPrice: SuggestedSellingPrice2
    offerInitialPrice: OfferInitialPrice
    priceType: string
    rateType: string
}

export interface Rate {
    rateId: string
    occupancyNumber: number
    name: string
    maxOccupancy: number
    adultCount: number
    childCount: number
    boardType: string
    boardName: string
    remarks: string
    priceType: string
    commission: Commission[]
    retailRate: RetailRate
    cancellationPolicies: CancellationPolicies
}

export interface Commission {
    amount: number
    currency: string
}

export interface RetailRate {
    total: Total[]
    suggestedSellingPrice: SuggestedSellingPrice[]
    initialPrice: InitialPrice[]
    taxesAndFees?: TaxesAndFee[]
}

export interface Total {
    amount: number
    currency: string
}

export interface SuggestedSellingPrice {
    amount: number
    currency: string
}

export interface InitialPrice {
    amount: number
    currency: string
}

export interface TaxesAndFee {
    included: boolean
    description: string
    amount: number
    currency: string
}

export interface CancellationPolicies {
    cancelPolicyInfos: CancelPolicyInfo[]
    hotelRemarks: string[]
    refundableTag: string
}

export interface CancelPolicyInfo {
    cancelTime: string
    amount: number
    currency?: string
    type: string
    timezone: string
}

export interface OfferRetailRate {
    amount: number
    currency: string
}

export interface SuggestedSellingPrice2 {
    amount: number
    currency: string
}

export interface OfferInitialPrice {
    amount: number
    currency: string
}