export function formatDistanceKm(distanceKm: unknown, suffix = " away"): string | null {
  const value = Number(distanceKm);
  if (!Number.isFinite(value) || value < 0) return null;
  if (value < 1) return `${Math.max(1, Math.round(value * 1000))} m${suffix}`;
  return `${value.toFixed(1)} km${suffix}`;
}
