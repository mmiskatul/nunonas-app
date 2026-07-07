import { getMapEvents } from "./customer-api";

function toNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function normalizeOfferItem(item = {}) {
  const latitude = toNumber(item.latitude);
  const longitude = toNumber(item.longitude);

  if (latitude == null || longitude == null) {
    return null;
  }

  return {
    id: item.id ?? item._id ?? `${latitude}-${longitude}`,
    title: item.name ?? item.title ?? "Nearby offer",
    category: String(item.category ?? item.entity_type ?? "").toLowerCase(),
    entityType: String(item.entity_type ?? item.category ?? "").toLowerCase(),
    offerText: item.offer_text ?? "Offer available",
    locationLabel: item.address ?? item.location ?? item.city ?? "Location available",
    distanceKm: toNumber(item.distance_km),
    latitude,
    longitude,
    imageUrl: item.cover_image_url ?? item.image_url ?? "",
    eventType: item.event_type ?? "Event",
    venue: item.venue ?? item.location ?? "Venue available",
    ticketPrice: item.ticket_price ?? null,
    capacity: item.capacity ?? null,
    bookingMode: item.booking_mode ?? "simple",
    canBookOnMap: Boolean(item.can_book_on_map),
    currentBookingStatus: item.current_booking_status ?? "",
    currentBookingCode: item.current_booking_code ?? "",
    isSoldOut: Boolean(item.is_sold_out),
    remainingCapacity: toNumber(item.remaining_capacity),
    detailRoute: item.detail_route ?? null,
  };
}

export async function listNearbyOffers(limit = 12) {
  const payload = await getMapEvents(limit);
  const items = Array.isArray(payload?.items) ? payload.items : [];

  return items
    .map(normalizeOfferItem)
    .filter(Boolean)
    .sort((left, right) => {
      const leftDistance = left.distanceKm ?? Number.MAX_SAFE_INTEGER;
      const rightDistance = right.distanceKm ?? Number.MAX_SAFE_INTEGER;
      return leftDistance - rightDistance;
    });
}
