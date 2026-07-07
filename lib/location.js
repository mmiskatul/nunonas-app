import * as Location from "expo-location";

export function isExpectedLocationError(error) {
  const message = String(error?.message || "").toLowerCase();

  return (
    message.includes("location services") ||
    message.includes("current location is unavailable") ||
    message.includes("permission")
  );
}

export async function getCurrentCoords(options = {}) {
  const servicesEnabled = await Location.hasServicesEnabledAsync();
  if (!servicesEnabled) {
    return null;
  }

  const permission = await Location.requestForegroundPermissionsAsync();
  if (!permission.granted) {
    return null;
  }

  const position = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
    ...options,
  });

  return {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
    accuracy: position.coords.accuracy ?? null,
  };
}
