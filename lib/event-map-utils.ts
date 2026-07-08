import type { CustomerMapEventPayload, NormalizedMapEvent } from "./event-map-types";

export function formatEventDate(value?: string | null): string {
  if (!value) {
    return "Date TBA";
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function formatEventTime(startTime?: string | null, endTime?: string | null): string {
  if (!startTime) {
    return "Time TBA";
  }

  const start = String(startTime).slice(0, 5);
  const end = endTime ? String(endTime).slice(0, 5) : "";
  return end ? `${start} - ${end}` : start;
}

export function getDistanceText(distanceKm: number | null): string {
  if (typeof distanceKm !== "number") {
    return "Nearby";
  }

  return `${distanceKm.toFixed(1)} km`;
}

export function getFirstQueryParam(value: string | string[] | undefined): string | null {
  if (Array.isArray(value)) {
    return value[0] ?? null;
  }

  return value ?? null;
}

function toNumber(value: number | string | null | undefined): number | null {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

function normalizeBookingMode(value?: string | null): "simple" | "detailed" {
  return value === "detailed" ? "detailed" : "simple";
}

export function normalizeMapEvent(item: CustomerMapEventPayload = {}): NormalizedMapEvent {
  const distanceValue = toNumber(item.distance_km) ?? item.distanceKm ?? null;
  const location = item.location ?? item.venue ?? "Venue available";
  const address = item.address ?? item.locationLabel ?? item.location ?? item.venue ?? "Address available";
  const ticketPriceValue = toNumber(item.ticket_price) ?? toNumber(item.ticketPrice);
  const remainingCapacity = toNumber(item.remaining_capacity) ?? item.remainingCapacity ?? null;

  return {
    id: item.id ?? item._id ?? "",
    title: item.title ?? item.name ?? "Untitled Event",
    date: formatEventDate(item.event_date),
    time: formatEventTime(item.start_time, item.end_time),
    location,
    locationLabel: item.locationLabel ?? address,
    venue: item.venue ?? item.location ?? "Venue available",
    address,
    tag: item.offer_text ?? item.offerText ?? item.event_type ?? item.eventType ?? "Live Event",
    eventType: item.event_type ?? item.eventType ?? "Event",
    imageUrl: item.banner_image_url ?? item.cover_image_url ?? item.image_url ?? item.imageUrl ?? "",
    description: item.description ?? "",
    capacity: toNumber(item.capacity),
    ticketPrice: ticketPriceValue != null ? `${ticketPriceValue}` : null,
    distance: getDistanceText(distanceValue),
    distanceKm: distanceValue,
    rating: item.rating ?? null,
    reviewsCount: item.reviews_count ?? item.reviewsCount ?? null,
    latitude: toNumber(item.latitude),
    longitude: toNumber(item.longitude),
    bookingMode: normalizeBookingMode(item.booking_mode ?? item.bookingMode),
    canBookOnMap: Boolean(item.can_book_on_map ?? item.canBookOnMap),
    currentBookingStatus: item.current_booking_status ?? item.currentBookingStatus ?? "",
    currentBookingCode: item.current_booking_code ?? item.currentBookingCode ?? "",
    isSoldOut: Boolean(item.is_sold_out ?? item.isSoldOut),
    remainingCapacity,
    detailRoute: item.detail_route ?? item.detailRoute ?? (item.id ? `/home/events/${item.id}` : null),
  };
}

export function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}
