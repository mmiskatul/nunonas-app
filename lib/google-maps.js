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

export async function reverseGeocode(latitude, longitude) {
  if (!GOOGLE_MAPS_API_KEY) {
    console.warn("No Google Maps API Key found");
    return null;
  }
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`
    );
    const data = await response.json();
    if (data.status === "OK" && data.results && data.results.length > 0) {
      let city = "";
      let country = "";
      for (const component of data.results[0].address_components) {
        if (component.types.includes("locality")) {
          city = component.long_name;
        } else if (component.types.includes("administrative_area_level_1") && !city) {
          city = component.long_name;
        }
        if (component.types.includes("country")) {
          country = component.long_name;
        }
      }
      if (city && country) {
        return `${city} ${country}`;
      } else if (city) {
        return city;
      } else if (country) {
        return country;
      }
      return data.results[0].formatted_address;
    }
  } catch (error) {
    console.error("Error reverse geocoding:", error);
  }
  return null;
}
