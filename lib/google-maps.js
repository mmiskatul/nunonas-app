const GOOGLE_STATIC_MAPS_BASE_URL = "https://maps.googleapis.com/maps/api/staticmap";
const GOOGLE_MAPS_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || "";

function decodePolyline(encoded) {
  const coordinates = [];
  let index = 0;
  let latitude = 0;
  let longitude = 0;

  while (index < encoded.length) {
    let result = 0;
    let shift = 0;
    let byte;

    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);

    latitude += result & 1 ? ~(result >> 1) : result >> 1;

    result = 0;
    shift = 0;

    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);

    longitude += result & 1 ? ~(result >> 1) : result >> 1;

    coordinates.push({
      latitude: latitude / 1e5,
      longitude: longitude / 1e5,
    });
  }

  return coordinates;
}

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

export async function getDrivingRoute(origin, destination) {
  if (!GOOGLE_MAPS_API_KEY || !origin || !destination) {
    return null;
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&mode=driving&key=${GOOGLE_MAPS_API_KEY}`
    );
    const data = await response.json();

    if (data.status !== "OK" || !data.routes?.length) {
      return null;
    }

    const route = data.routes[0];
    const leg = route.legs?.[0];

    return {
      distanceMeters: leg?.distance?.value ?? null,
      distanceText: leg?.distance?.text ?? null,
      durationSeconds: leg?.duration?.value ?? null,
      durationText: leg?.duration?.text ?? null,
      coordinates: route.overview_polyline?.points
        ? decodePolyline(route.overview_polyline.points)
        : [],
    };
  } catch (error) {
    console.error("Error fetching driving route:", error);
    return null;
  }
}

export function buildDirectionsUrl(origin, destination) {
  if (!origin || !destination) {
    return null;
  }

  const params = new URLSearchParams({
    api: "1",
    origin: `${origin.latitude},${origin.longitude}`,
    destination: `${destination.latitude},${destination.longitude}`,
    travelmode: "driving",
  });

  return `https://www.google.com/maps/dir/?${params.toString()}`;
}
