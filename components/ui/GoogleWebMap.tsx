import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot, type Root } from "react-dom/client";
import { GrCafeteria } from "react-icons/gr";
import { FaSpa } from "react-icons/fa";
import { MdEventNote, MdHotel } from "react-icons/md";
import { StyleSheet, Text, View } from "react-native";
import theme from "../../constants/theme";
import { GOOGLE_MAPS_API_KEY } from "../../lib/google-maps";
import type { GeoCoordinates } from "../../lib/event-map-types";

export type GoogleWebMarker = {
  id: string;
  title: string;
  latitude: number;
  longitude: number;
  imageUrl?: string | null;
  kind?: "event" | "happy_hour" | "restaurant" | "spa" | "hotel";
};

type Props = {
  center: GeoCoordinates;
  markers?: GoogleWebMarker[];
  selectedId?: string | null;
  onMarkerPress?: (marker: GoogleWebMarker) => void;
  height?: number;
  zoomLevel?: number;
  showCenterMarker?: boolean;
};

type GoogleMapInstance = {
  setCenter: (position: { lat: number; lng: number }) => void;
};

type AdvancedMarkerInstance = HTMLElement & {
  map?: GoogleMapInstance | null;
  addListener: (eventName: string, handler: () => void) => unknown;
};

type GoogleMapsRuntime = {
  importLibrary?: (libraryName: string) => Promise<Record<string, unknown>>;
  event?: {
    clearInstanceListeners: (instance: object) => void;
  };
};

type ReadyGoogleMaps = {
  Map: new (
    element: HTMLElement,
    options: Record<string, unknown>,
  ) => GoogleMapInstance;
  AdvancedMarkerElement: new (
    options: Record<string, unknown>,
  ) => AdvancedMarkerInstance;
  event?: GoogleMapsRuntime["event"];
};

declare global {
  interface Window {
    google?: {
      maps?: GoogleMapsRuntime;
    };
  }
}

const SCRIPT_ID = "nuno-google-maps-script";
let googleMapsPromise: Promise<ReadyGoogleMaps> | null = null;

async function resolveGoogleMaps(): Promise<ReadyGoogleMaps | null> {
  const maps = window.google?.maps;
  if (!maps?.importLibrary) return null;
  const [mapsLibrary, markerLibrary] = await Promise.all([
    maps.importLibrary("maps"),
    maps.importLibrary("marker"),
  ]);
  if (
    typeof mapsLibrary.Map !== "function" ||
    typeof markerLibrary.AdvancedMarkerElement !== "function"
  ) {
    return null;
  }
  return {
    Map: mapsLibrary.Map as ReadyGoogleMaps["Map"],
    AdvancedMarkerElement:
      markerLibrary.AdvancedMarkerElement as ReadyGoogleMaps["AdvancedMarkerElement"],
    event: maps.event,
  };
}

function loadGoogleMaps(): Promise<ReadyGoogleMaps> {
  if (googleMapsPromise) return googleMapsPromise;
  googleMapsPromise = new Promise<ReadyGoogleMaps>((resolve, reject) => {
    if (!GOOGLE_MAPS_API_KEY) {
      reject(new Error("Google Maps API key is not configured."));
      return;
    }

    const startedAt = Date.now();
    const check = async () => {
      try {
        const ready = await resolveGoogleMaps();
        if (ready) {
          resolve(ready);
          return;
        }
      } catch (error) {
        reject(error);
        return;
      }
      if (Date.now() - startedAt > 15_000) {
        reject(new Error("Google Maps could not be initialized."));
        return;
      }
      window.setTimeout(check, 50);
    };

    let script = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.id = SCRIPT_ID;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(
        GOOGLE_MAPS_API_KEY,
      )}&loading=async&v=weekly`;
      script.async = true;
      script.defer = true;
      script.addEventListener("error", () =>
        reject(new Error("Google Maps could not be loaded.")),
      );
      document.head.appendChild(script);
    }
    void check();
  }).catch((error) => {
    googleMapsPromise = null;
    throw error;
  });
  return googleMapsPromise;
}

function createCurrentLocationContent(): HTMLDivElement {
  const ring = document.createElement("div");
  Object.assign(ring.style, {
    width: "22px",
    height: "22px",
    borderRadius: "50%",
    border: "4px solid #ffffff",
    background: "#2563eb",
    boxShadow: "0 3px 10px rgba(15, 23, 42, 0.28)",
  });
  return ring;
}

function createEventContent(
  marker: GoogleWebMarker,
  selected: boolean,
): { button: HTMLButtonElement; iconRoot?: Root } {
  const button = document.createElement("button");
  button.type = "button";
  button.setAttribute("aria-label", `Event location: ${marker.title}`);
  Object.assign(button.style, {
    minWidth: "96px",
    padding: "0",
    border: "0",
    background: "transparent",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    cursor: "pointer",
    transform: "translateY(-2px)",
  });

  const title = document.createElement("span");
  title.textContent = marker.title;
  Object.assign(title.style, {
    maxWidth: "160px",
    marginBottom: "6px",
    padding: "5px 10px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    borderRadius: "999px",
    border: `1px solid ${selected ? theme.COLORS.primary : "#e2e8f0"}`,
    background: selected ? theme.COLORS.primary : "rgba(255,255,255,0.97)",
    color: selected ? "#ffffff" : "#0f172a",
    fontSize: "11px",
    fontWeight: "800",
    boxShadow: "0 3px 8px rgba(15,23,42,0.18)",
  });
  button.appendChild(title);

  const ring = document.createElement("span");
  Object.assign(ring.style, {
    width: selected ? "46px" : "40px",
    height: selected ? "46px" : "40px",
    padding: "0",
    overflow: "visible",
    boxSizing: "border-box",
    borderRadius: "50%",
    border: `3px solid ${selected ? theme.COLORS.primary : "#ffffff"}`,
    background: marker.imageUrl ? "#ffffff" : "#16a34a",
    color: marker.imageUrl ? theme.COLORS.primary : "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "16px",
    fontWeight: "800",
    boxShadow: "0 5px 12px rgba(15,23,42,0.28)",
    transform: selected ? "scale(1.1)" : "scale(1)",
  });
  let iconRoot: Root | undefined;
  if (marker.kind === "event" || marker.kind === "spa" || marker.kind === "hotel") {
    const iconHost = document.createElement("span");
    Object.assign(iconHost.style, {
      width: "100%",
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      lineHeight: "1",
    });
    ring.appendChild(iconHost);
    iconRoot = createRoot(iconHost);
    const Icon = marker.kind === "spa" ? FaSpa : marker.kind === "hotel" ? MdHotel : MdEventNote;
    iconRoot.render(<Icon size={selected ? 26 : 22} aria-hidden />);
  } else if (marker.imageUrl) {
    const image = document.createElement("img");
    image.src = marker.imageUrl;
    image.alt = "";
    Object.assign(image.style, {
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      objectFit: "cover",
    });
    ring.appendChild(image);
  } else {
    ring.textContent = marker.title.slice(0, 1).toUpperCase();
  }
  button.appendChild(ring);
  return { button, iconRoot };
}

function createRestaurantContent(
  marker: GoogleWebMarker,
  selected: boolean,
): { button: HTMLButtonElement; iconRoot: Root } {
  const button = document.createElement("button");
  button.type = "button";
  button.title = marker.title;
  button.setAttribute("aria-label", `Restaurant: ${marker.title}`);
  Object.assign(button.style, {
    width: selected ? "42px" : "36px",
    height: selected ? "42px" : "36px",
    padding: "0",
    boxSizing: "border-box",
    borderRadius: "50%",
    border: `2px solid ${selected ? theme.COLORS.primary : "#ffffff"}`,
    background: "#16a34a",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(15,23,42,0.32)",
    transition: "width 150ms ease, height 150ms ease, border-color 150ms ease",
  });
  const iconHost = document.createElement("span");
  Object.assign(iconHost.style, {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    lineHeight: "1",
  });
  button.appendChild(iconHost);
  const iconRoot = createRoot(iconHost);
  iconRoot.render(
    <GrCafeteria size={selected ? 25 : 21} aria-hidden />,
  );
  return { button, iconRoot };
}

export default function GoogleWebMap({
  center,
  markers = [],
  selectedId,
  onMarkerPress,
  height = 260,
  zoomLevel = 13,
  showCenterMarker = true,
}: Props) {
  const containerRef = useRef<HTMLElement | null>(null);
  const [mapError, setMapError] = useState("");
  const markersKey = useMemo(
    () =>
      markers
        .map(
          (marker) =>
            `${marker.id}:${marker.latitude}:${marker.longitude}:${marker.title}:${marker.imageUrl ?? ""}:${marker.kind ?? "event"}`,
        )
        .join("|"),
    [markers],
  );

  useEffect(() => {
    const element = containerRef.current;
    if (!element || !GOOGLE_MAPS_API_KEY) return;
    let cancelled = false;
    const markerInstances: AdvancedMarkerInstance[] = [];
    const markerIconRoots: Root[] = [];

    void loadGoogleMaps()
      .then((googleMaps) => {
        if (cancelled) return;
        setMapError("");
        const map = new googleMaps.Map(element, {
          center: { lat: center.latitude, lng: center.longitude },
          zoom: zoomLevel,
          mapId: process.env.EXPO_PUBLIC_GOOGLE_MAPS_MAP_ID || "DEMO_MAP_ID",
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
        });

        if (showCenterMarker) {
          const currentMarker = new googleMaps.AdvancedMarkerElement({
            map,
            position: { lat: center.latitude, lng: center.longitude },
            title: "Current location",
            zIndex: 1,
          });
          currentMarker.appendChild(createCurrentLocationContent());
          markerInstances.push(currentMarker);
        }

        markers.forEach((marker) => {
          const selected = selectedId === marker.id;
          const advancedMarker = new googleMaps.AdvancedMarkerElement({
            map,
            position: { lat: marker.latitude, lng: marker.longitude },
            title: marker.title,
            gmpClickable: true,
            zIndex: selected ? 3 : 2,
          });
          if (marker.kind === "restaurant") {
            const content = createRestaurantContent(marker, selected);
            markerIconRoots.push(content.iconRoot);
            advancedMarker.appendChild(content.button);
          } else {
            const content = createEventContent(marker, selected);
            if (content.iconRoot) markerIconRoots.push(content.iconRoot);
            advancedMarker.appendChild(content.button);
          }
          advancedMarker.addListener("click", () => onMarkerPress?.(marker));
          markerInstances.push(advancedMarker);
        });
      })
      .catch((error) => {
        if (!cancelled) {
          setMapError(
            error instanceof Error ? error.message : "The live map is unavailable.",
          );
        }
      });

    return () => {
      cancelled = true;
      markerIconRoots.forEach((root) => root.unmount());
      markerInstances.forEach((marker) => {
        window.google?.maps?.event?.clearInstanceListeners(marker);
        marker.map = null;
        marker.remove();
      });
    };
  }, [
    center.latitude,
    center.longitude,
    markersKey,
    onMarkerPress,
    selectedId,
    showCenterMarker,
    zoomLevel,
  ]);

  if (!GOOGLE_MAPS_API_KEY || mapError) {
    return (
      <View style={[styles.unavailable, { height }]}>
        <Text style={styles.unavailableText}>
          {mapError || "The live map is not configured."}
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { height }]}>
      <View
        ref={(node) => {
          containerRef.current = node as unknown as HTMLElement | null;
        }}
        style={styles.map}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    overflow: "hidden",
    backgroundColor: "#dbeafe",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  unavailable: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#eff6ff",
  },
  unavailableText: {
    color: theme.COLORS.textSecondary,
    textAlign: "center",
    fontSize: 13,
    fontWeight: "600",
  },
});
