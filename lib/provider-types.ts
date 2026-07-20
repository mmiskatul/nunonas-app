import type { ImageSourcePropType } from "react-native";

export type ProviderPayload = {
  id?: string | number | null;
  _id?: string | number | null;
  title?: string | null;
  name?: string | null;
  rating?: number | string | null;
  reviews?: number | string | null;
  reviews_count?: number | string | null;
  category?: string | null;
  cuisine?: string | null;
  type?: string | null;
  price?: number | string | null;
  price_range?: string | null;
  priceRange?: string | null;
  distance?: string | null;
  distance_km?: number | string | null;
  location?: string | null;
  address?: string | null;
  city?: string | null;
  cover_image_url?: string | null;
  image_url?: string | null;
  image?: string | null;
  description?: string | null;
  about?: string | null;
  status?: string | null;
  amenities?: string[] | null;
  opening_hours?: { open_time?: string | null; close_time?: string | null; is_open_now?: boolean } | null;
  service_name?: string | null;
  service_type?: string | null;
  duration?: number | string | null;
  duration_minutes?: number | string | null;
  active_status?: boolean | null;
  available?: boolean | null;
};

export type ProviderCollectionResponse<TItem = ProviderPayload> = {
  items?: TItem[];
};

export type NormalizedRestaurant = {
  id: string;
  title: string;
  ratingText: string;
  reviewsText: string;
  reviewsCount: number;
  category: string;
  priceRange: string;
  distanceText: string;
  locationText: string;
  imageUrl: string;
  description: string;
  amenities: string[];
  openingHours?: { open_time?: string | null; close_time?: string | null; is_open_now?: boolean };
};

export type NormalizedHotel = {
  id: string;
  title: string;
  ratingText: string;
  reviewsText: string;
  reviewsCount: number;
  priceText: string;
  priceRange: string;
  locationText: string;
  imageUrl: string;
  statusText: string;
  description: string;
  amenities: string[];
  openingHours?: { open_time?: string | null; close_time?: string | null; is_open_now?: boolean };
  distanceKm?: number | null;
};

export type NormalizedSpa = {
  id: string;
  title: string;
  ratingText: string;
  reviewsText: string;
  reviewsCount: number;
  category: string;
  typeText: string;
  distanceText: string;
  locationText: string;
  imageUrl: string;
  description: string;
  amenities: string[];
  openingHours?: { open_time?: string | null; close_time?: string | null; is_open_now?: boolean };
};

export type ProviderImageSource = ImageSourcePropType;
