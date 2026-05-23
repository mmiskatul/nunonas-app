const GOOGLE_STATIC_MAPS_BASE_URL = "https://maps.googleapis.com/maps/api/staticmap";
const GOOGLE_MAPS_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || "";

export function buildStaticMapUrl({
  center,
  zoom = 14,
  width = 600,
  height = 300,
  scale = 2,
  markerLabel,
} = {}) {
  if (!GOOGLE_MAPS_API_KEY || !center) {
    return null;
  }

  const params = new URLSearchParams({
    center,
    zoom: String(zoom),
    size: `${width}x${height}`,
    scale: String(scale),
    maptype: "roadmap",
    key: GOOGLE_MAPS_API_KEY,
  });

  const markerParts = ["color:red"];
  if (markerLabel) {
    markerParts.push(`label:${String(markerLabel).slice(0, 1).toUpperCase()}`);
  }
  markerParts.push(center);
  params.append("markers", markerParts.join("|"));

  return `${GOOGLE_STATIC_MAPS_BASE_URL}?${params.toString()}`;
}
