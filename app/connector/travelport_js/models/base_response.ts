export interface HotelProperty {
  id: string;
  name: string;
  chainCode?: string;
  address: {
    line1: string;
    city: string;
    countryCode: string;
    postalCode?: string;
  };
  location: {
    latitude: number;
    longitude: number;
  };
  rating?: number;
}

export interface BaseHotelSearchResponse {
  properties: HotelProperty[];
  totalCount: number;
  status: {
    success: boolean;
    messageId: string;
  };
}

