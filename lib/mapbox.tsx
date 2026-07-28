import type { DrivingRoute, GeoCoordinates } from "./event-map-types";

export const MAPBOX_ACCESS_TOKEN = process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN || "";
export const MAPBOX_STYLE = "mapbox/streets-v12";

type StaticMapOptions = {
  center?: string | GeoCoordinates | null;
  zoom?: number;
  width?: number;
  height?: number;
  scale?: number;
  markerLabel?: string;
};

type MapboxFeature = {
  place_name?: string;
  text?: string;
  center?: [number, number];
  properties?: {
    full_address?: string;
    name?: string;
    place_formatted?: string;
  };
};

function parseCenter(center: StaticMapOptions["center"]): GeoCoordinates | null {
  if (!center) return null;
  if (typeof center !== "string") return center;
  const values = center.split(",").map((value) => Number(value.trim()));
  if (values.length !== 2 || values.some((value) => !Number.isFinite(value))) return null;
  return { latitude: values[0], longitude: values[1] };
}

function formatDistance(meters: number | null | undefined): string | null {
  if (!Number.isFinite(meters)) return null;
  return meters! >= 1000 ? `${(meters! / 1000).toFixed(1)} km` : `${Math.round(meters!)} m`;
}

function formatDuration(seconds: number | null | undefined): string | null {
  if (!Number.isFinite(seconds)) return null;
  const minutes = Math.max(Math.round(seconds! / 60), 1);
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  return remaining ? `${hours} hr ${remaining} min` : `${hours} hr`;
}

export function buildStaticMapUrl({
  center,
  zoom = 14,
  width = 600,
  height = 300,
  scale = 2,
}: StaticMapOptions = {}): string | null {
  const coordinates = parseCenter(center);
  if (!MAPBOX_ACCESS_TOKEN || !coordinates) return null;
  const longitude = coordinates.longitude.toFixed(6);
  const latitude = coordinates.latitude.toFixed(6);
  const dimensions = `${Math.min(Math.max(Math.round(width), 1), 1280)}x${Math.min(Math.max(Math.round(height), 1), 1280)}`;
  const pixelRatio = scale >= 2 ? "@2x" : "";
  return `https://api.mapbox.com/styles/v1/${MAPBOX_STYLE}/static/pin-s+1e3a8a(${longitude},${latitude})/${longitude},${latitude},${zoom}/${dimensions}${pixelRatio}?access_token=${encodeURIComponent(MAPBOX_ACCESS_TOKEN)}`;
}

export async function forwardGeocode(query: string): Promise<GeoCoordinates | null> {
  if (!MAPBOX_ACCESS_TOKEN || !query.trim()) return null;
  try {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query.trim())}.json?limit=1&access_token=${encodeURIComponent(MAPBOX_ACCESS_TOKEN)}`,
    );
    if (!response.ok) return null;
    const data = (await response.json()) as { features?: MapboxFeature[] };
    const center = data.features?.[0]?.center;
    return center ? { longitude: center[0], latitude: center[1] } : null;
  } catch (error) {
    console.error("Mapbox forward geocoding failed:", error);
    return null;
  }
}

export async function reverseGeocode(latitude: number, longitude: number): Promise<string | null> {
  if (!MAPBOX_ACCESS_TOKEN) return null;
  try {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?limit=1&access_token=${encodeURIComponent(MAPBOX_ACCESS_TOKEN)}`,
    );
    if (!response.ok) return null;
    const data = (await response.json()) as { features?: MapboxFeature[] };
    const feature = data.features?.[0];
    return feature?.properties?.full_address
      || feature?.place_name
      || feature?.properties?.place_formatted
      || feature?.properties?.name
      || feature?.text
      || null;
  } catch (error) {
    console.error("Mapbox reverse geocoding failed:", error);
    return null;
  }
}

export async function getDrivingRoute(
  origin: GeoCoordinates | null,
  destination: GeoCoordinates | null,
): Promise<DrivingRoute | null> {
  if (!MAPBOX_ACCESS_TOKEN || !origin || !destination) return null;
  try {
    const coordinates = `${origin.longitude},${origin.latitude};${destination.longitude},${destination.latitude}`;
    const response = await fetch(
      `https://api.mapbox.com/directions/v5/mapbox/driving/${coordinates}?alternatives=false&geometries=geojson&overview=full&steps=false&access_token=${encodeURIComponent(MAPBOX_ACCESS_TOKEN)}`,
    );
    if (!response.ok) return null;
    const data = (await response.json()) as {
      routes?: Array<{
        distance?: number;
        duration?: number;
        geometry?: { coordinates?: Array<[number, number]> };
      }>;
    };
    const route = data.routes?.[0];
    if (!route) return null;
    return {
      distanceMeters: route.distance ?? null,
      distanceText: formatDistance(route.distance),
      durationSeconds: route.duration ?? null,
      durationText: formatDuration(route.duration),
      coordinates: (route.geometry?.coordinates ?? []).map(([longitudeValue, latitudeValue]) => ({
        latitude: latitudeValue,
        longitude: longitudeValue,
      })),
    };
  } catch (error) {
    console.error("Mapbox directions failed:", error);
    return null;
  }
}

export function buildDirectionsUrl(
  origin: GeoCoordinates | null,
  destination: GeoCoordinates | null,
): string | null {
  if (!origin || !destination) return null;
  const route = `${origin.longitude},${origin.latitude};${destination.longitude},${destination.latitude}`;
  return `https://www.mapbox.com/directions/?route=${encodeURIComponent(route)}`;
}

export function buildPlaceUrl(destination: GeoCoordinates | null): string | null {
  if (!destination) return null;
  return buildStaticMapUrl({ center: destination, zoom: 16, width: 900, height: 600, scale: 1 });
}
