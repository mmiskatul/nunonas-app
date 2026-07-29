import { getMapEvents, getMapHappyHours } from "./customer-events";
import { isEventNotExpired, normalizeMapEvent } from "./event-map-utils";
import type { NormalizedMapEvent } from "./event-map-types";

export async function listNearbyOffers(limit = 12): Promise<NormalizedMapEvent[]> {
  const responses = await Promise.allSettled([
    getMapEvents(limit),
    getMapHappyHours(limit),
  ]);
  const payloads = responses.flatMap((response) =>
    response.status === "fulfilled" ? [response.value] : [],
  );
  if (!payloads.length) {
    const failure = responses.find(
      (response) => response.status === "rejected",
    );
    throw failure?.status === "rejected" && failure.reason instanceof Error
      ? failure.reason
      : new Error("Nearby events and Happy Hours could not be loaded.");
  }
  const items = payloads.flatMap((payload) =>
    Array.isArray(payload.items) ? payload.items : [],
  );
  const seen = new Set<string>();

  return items
    .map((item) => normalizeMapEvent(item))
    .filter(
      (item) => {
        const key = `${item.entityType}:${item.id}`;
        if (
          !item.id ||
          seen.has(key) ||
          item.latitude == null ||
          item.longitude == null ||
          (item.entityType !== "happy_hour" &&
            !isEventNotExpired(item.eventDate, item.endTime))
        ) {
          return false;
        }
        seen.add(key);
        return true;
      },
    )
    .sort((left, right) => {
      const leftDistance = left.distanceKm ?? Number.MAX_SAFE_INTEGER;
      const rightDistance = right.distanceKm ?? Number.MAX_SAFE_INTEGER;
      return leftDistance - rightDistance;
    });
}
