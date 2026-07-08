import { getMapEvents } from "./customer-events";
import { normalizeMapEvent } from "./event-map-utils";
import type { NormalizedMapEvent } from "./event-map-types";

export async function listNearbyOffers(limit = 12): Promise<NormalizedMapEvent[]> {
  const payload = await getMapEvents(limit);
  const items = Array.isArray(payload.items) ? payload.items : [];

  return items
    .map((item) => normalizeMapEvent(item))
    .filter((item) => item.latitude != null && item.longitude != null)
    .sort((left, right) => {
      const leftDistance = left.distanceKm ?? Number.MAX_SAFE_INTEGER;
      const rightDistance = right.distanceKm ?? Number.MAX_SAFE_INTEGER;
      return leftDistance - rightDistance;
    });
}
