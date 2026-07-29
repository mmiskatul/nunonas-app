import { getMapEvents, getMapHappyHours } from "./customer-events";
import { isEventNotExpired, normalizeMapEvent } from "./event-map-utils";
import type {
  CustomerMapEventPayload,
  NormalizedMapEvent,
} from "./event-map-types";

function itemsFromFeed(
  response: PromiseSettledResult<{ items?: CustomerMapEventPayload[] }>,
  entityType: "event" | "happy_hour",
): CustomerMapEventPayload[] {
  if (response.status !== "fulfilled" || !Array.isArray(response.value.items)) {
    return [];
  }

  // The endpoint is authoritative. This prevents stale or malformed entity_type
  // fields from moving an Event into the Happy Hours tab (or vice versa).
  return response.value.items.map((item) => ({
    ...item,
    entity_type: entityType,
    entityType,
  }));
}

export async function listNearbyOffers(limit = 12): Promise<NormalizedMapEvent[]> {
  const responses = await Promise.allSettled([
    getMapEvents(limit),
    getMapHappyHours(limit),
  ]);
  if (responses.every((response) => response.status === "rejected")) {
    const failure = responses.find(
      (response) => response.status === "rejected",
    );
    throw failure?.status === "rejected" && failure.reason instanceof Error
      ? failure.reason
      : new Error("Nearby events and Happy Hours could not be loaded.");
  }
  const items = [
    ...itemsFromFeed(responses[0], "event"),
    ...itemsFromFeed(responses[1], "happy_hour"),
  ];
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
            !isEventNotExpired(
              item.eventDate,
              item.endTime,
              item.eventEndDate,
            ))
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
