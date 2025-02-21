import { TravelportResponse } from './base_response';
import { CustomResponse, HotelData } from './custom_response';

export function mapTravelportToCustomResponse(response: TravelportResponse): CustomResponse {
    const data: HotelData[] = response.hotelsResponse.propertyItems.map(property => ({
        hotelId: property.propertyCode,
        roomTypes: property.roomTypes?.map(roomType => ({
            roomTypeId: roomType.shortRoomDescription,
            offerId: roomType.rates[0]?.rateKey.value || '',
            supplier: 'Travelport',
            supplierId: 1,
            rates: roomType.rates.map(rate => ({
                rateId: rate.rateKey.value,
                occupancyNumber: roomType.maxOccupancy || 2,
                name: rate.rateDescription,
                maxOccupancy: roomType.maxOccupancy || 2,
                adultCount: 2,
                childCount: 0,
                boardType: rate.rateCodeInfo.rateType,
                boardName: rate.rateCodeInfo.rateCategory || '',
                remarks: rate.rateDescription,
                priceType: rate.rateCodeInfo.rateType,
                commission: rate.price.commission ? [{
                    amount: rate.price.commission.percent || 0,
                    currency: rate.price.currencyCode
                }] : [],
                retailRate: {
                    total: [{
                        amount: rate.price.totalPrice.amount,
                        currency: rate.price.currencyCode
                    }],
                    suggestedSellingPrice: [{
                        amount: rate.price.totalPrice.amount,
                        currency: rate.price.currencyCode
                    }],
                    initialPrice: [{
                        amount: rate.price.base.amount,
                        currency: rate.price.currencyCode
                    }],
                    taxesAndFees: rate.price.totalTaxes ? [{
                        included: rate.price.taxesIncludedInBase,
                        description: 'Taxes and Fees',
                        amount: rate.price.totalTaxes.amount,
                        currency: rate.price.currencyCode
                    }] : undefined
                },
                cancellationPolicies: {
                    cancelPolicyInfos: rate.terms.cancelPenalties.map(policy => ({
                        cancelTime: policy.deadlineLocal.toISOString(),
                        amount: policy.penalty.currencyAmount.amount,
                        currency: policy.penalty.currencyAmount.currency,
                        type: policy.cancelShortDescription,
                        timezone: 'UTC'
                    })),
                    hotelRemarks: [],
                    refundableTag: rate.terms.refundable ? 'Refundable' : 'Non-refundable'
                }
            })),
            offerRetailRate: {
                amount: roomType.rates[0]?.price.totalPrice.amount || 0,
                currency: roomType.rates[0]?.price.currencyCode || 'USD'
            },
            suggestedSellingPrice: {
                amount: roomType.rates[0]?.price.totalPrice.amount || 0,
                currency: roomType.rates[0]?.price.currencyCode || 'USD'
            },
            suggestedSellingPrice2: {
                amount: roomType.rates[0]?.price.totalPrice.amount || 0,
                currency: roomType.rates[0]?.price.currencyCode || 'USD'
            },
            offerInitialPrice: {
                amount: roomType.rates[0]?.price.base.amount || 0,
                currency: roomType.rates[0]?.price.currencyCode || 'USD'
            },
            priceType: roomType.rates[0]?.rateCodeInfo.rateType || '',
            rateType: roomType.rates[0]?.rateCodeInfo.rateType || ''
        })) || []
    }));

    return {
        data,
        // guestLevel: 1,
        // sandbox: false
    };
}