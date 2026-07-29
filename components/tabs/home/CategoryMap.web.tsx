import React, { useMemo } from "react";
import type { ProviderPayload } from "../../../lib/provider-types";
import type { DiscoveryKind } from "../../../lib/discovery-map";
import DiscoveryMap from "../../ui/DiscoveryMap";
type Props = { items: ProviderPayload[]; loading: boolean; kind: "spa" | "hotel" };
export default function CategoryMap({ items, loading, kind }: Props) {
  const mapItems = useMemo(() => items.flatMap((item) => { const latitude = Number(item.latitude); const longitude = Number(item.longitude); if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return []; return [{ id: String(item.id ?? item._id ?? ""), title: String(item.title ?? item.name ?? kind), kind: kind as DiscoveryKind, latitude, longitude, location: String(item.location ?? item.address ?? item.city ?? "Location unavailable"), imageUrl: String(item.cover_image_url ?? item.image_url ?? item.image ?? ""), rating: Number.isFinite(Number(item.rating)) ? Number(item.rating) : null, isOpenNow: item.is_open_now === true, hasOffer: Boolean(item.offer_text || (item as { badge?: unknown }).badge), nearMetro: Boolean(item.near_metro), detailRoute: `/home/${kind === "spa" ? "spa" : "hotels"}/${String(item.id ?? item._id)}` }]; }), [items, kind]);
  return <DiscoveryMap items={mapItems} loading={loading} />;
}
