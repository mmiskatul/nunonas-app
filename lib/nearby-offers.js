import { getMapEvents, listRestaurants } from "./customer-api";

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
  };
}

export async function listNearbyOffers(limit = 12) {
  const [offersPayload, eventsPayload] = await Promise.all([
    listRestaurants({ offers: true, limit }),
    getMapEvents(limit),
  ]);
  const items = [
    ...(Array.isArray(offersPayload?.items) ? offersPayload.items : []),
    ...(Array.isArray(eventsPayload?.items) ? eventsPayload.items : []),
  ];

  return items
    .map(normalizeOfferItem)
    .filter(Boolean)
    .sort((left, right) => {
      const leftDistance = left.distanceKm ?? Number.MAX_SAFE_INTEGER;
      const rightDistance = right.distanceKm ?? Number.MAX_SAFE_INTEGER;
      return leftDistance - rightDistance;
    });
}
