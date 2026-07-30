import React, { useEffect, useRef } from "react";
import { StyleSheet, View } from "react-native";
import Mapbox from "@rnmapbox/maps";
import type { GeoCoordinates } from "../../lib/event-map-types";

const MAPBOX_TOKEN = process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN || "";
Mapbox.setAccessToken(MAPBOX_TOKEN);

export type NativeMapboxMarker = {
  id: string;
  coordinate: GeoCoordinates;
  children: React.ReactNode;
  onPress?: () => void;
};

type Props = {
  center: GeoCoordinates;
  markers?: NativeMapboxMarker[];
  zoomLevel?: number;
  height?: number;
  showUserLocation?: boolean;
  routeCoordinates?: GeoCoordinates[];
  children?: React.ReactNode;
};

export default function NativeMapboxMap({
  center,
  markers = [],
  zoomLevel = 13,
  height,
  showUserLocation = true,
  routeCoordinates = [],
  children,
}: Props) {
  const cameraRef = useRef<Mapbox.Camera>(null);

  useEffect(() => {
    cameraRef.current?.setCamera({
      centerCoordinate: [center.longitude, center.latitude],
      zoomLevel,
      animationDuration: 0,
    });
  }, [center.latitude, center.longitude, zoomLevel]);

  return (
    <View style={[styles.container, height != null && { height }]}>
      <Mapbox.MapView style={styles.map} styleURL={Mapbox.StyleURL.Street} compassEnabled={false}>
        <Mapbox.Camera
          ref={cameraRef}
          defaultSettings={{
            centerCoordinate: [center.longitude, center.latitude],
            zoomLevel,
          }}
        />
        {showUserLocation ? <Mapbox.UserLocation visible showsUserHeadingIndicator={false} /> : null}
        {routeCoordinates.length > 1 ? (
          <Mapbox.ShapeSource
            id="native-mapbox-route"
            shape={{
              type: "Feature",
              properties: {},
              geometry: {
                type: "LineString",
                coordinates: routeCoordinates.map((point) => [point.longitude, point.latitude]),
              },
            } as never}
          >
            <Mapbox.LineLayer
              id="native-mapbox-route-line"
              style={{ lineColor: "#2563eb", lineWidth: 5, lineCap: "round", lineJoin: "round" }}
            />
          </Mapbox.ShapeSource>
        ) : null}
        {markers.map((marker) => (
          <Mapbox.PointAnnotation
            key={marker.id}
            id={marker.id}
            coordinate={[marker.coordinate.longitude, marker.coordinate.latitude]}
            onSelected={marker.onPress}
          >
            <View collapsable={false}>{marker.children}</View>
          </Mapbox.PointAnnotation>
        ))}
        {children}
      </Mapbox.MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: "100%", overflow: "hidden", backgroundColor: "#dbeafe" },
  map: { flex: 1 },
});
