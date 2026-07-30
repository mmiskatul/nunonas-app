import Constants from "expo-constants";
import React, { useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { WebView } from "react-native-webview";
import type { GeoCoordinates } from "../../lib/event-map-types";

const MAPBOX_TOKEN =
  process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN ||
  Constants.expoConfig?.extra?.mapboxAccessToken ||
  Constants.manifest?.extra?.mapboxAccessToken ||
  "";

export type NativeMapboxMarker = {
  id: string;
  coordinate: GeoCoordinates;
  children: React.ReactNode;
  onPress?: () => void;
  title?: string;
  kind?: "event" | "happy_hour" | "restaurant" | "spa" | "hotel";
};

type Props = {
  center: GeoCoordinates;
  markers?: NativeMapboxMarker[];
  zoomLevel?: number;
  height?: number;
  showUserLocation?: boolean;
  routeCoordinates?: GeoCoordinates[];
};

export default function NativeMapboxMap({
  center,
  markers = [],
  zoomLevel = 13,
  height,
  showUserLocation = true,
  routeCoordinates = [],
}: Props) {
  const [mapError, setMapError] = useState("");
  const mapHtml = useMemo(() => {
    const markerData = markers.map((marker) => ({
      id: marker.id,
      title: marker.title || marker.id,
      latitude: marker.coordinate.latitude,
      longitude: marker.coordinate.longitude,
      kind: marker.kind || "restaurant",
    }));
    const route = routeCoordinates.map((point) => [point.longitude, point.latitude]);
    const json = JSON.stringify({
      token: MAPBOX_TOKEN,
      center: [center.longitude, center.latitude],
      zoom: zoomLevel,
      markers: markerData,
      route,
      showUserLocation,
    }).replace(/</g, "\\u003c");
    return `<!doctype html><html><head><meta name="viewport" content="initial-scale=1, maximum-scale=1, user-scalable=no"/><link href="https://api.mapbox.com/mapbox-gl-js/v3.15.0/mapbox-gl.css" rel="stylesheet"/><style>html,body,#map{height:100%;margin:0}.marker{width:40px;height:40px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:#16a34a;border:3px solid #fff;box-shadow:0 3px 10px #0f172a66}.marker span{display:block;transform:rotate(45deg);color:#fff;text-align:center;font:700 18px Arial;line-height:34px}.marker.restaurant span{font-size:20px}.user{width:18px;height:18px;border-radius:50%;background:#2563eb;border:4px solid #fff;box-shadow:0 2px 8px #0f172a66}</style></head><body><div id="map"></div><script src="https://api.mapbox.com/mapbox-gl-js/v3.15.0/mapbox-gl.js"></script><script>window.onerror=(message)=>window.ReactNativeWebView.postMessage(JSON.stringify({type:'error',message:String(message)}));const config=${json};mapboxgl.accessToken=config.token;const map=new mapboxgl.Map({container:'map',style:'mapbox://styles/mapbox/streets-v12',center:config.center,zoom:config.zoom,attributionControl:true});map.on('error',event=>window.ReactNativeWebView.postMessage(JSON.stringify({type:'error',message:event.error?.message||'Mapbox map error'})));map.addControl(new mapboxgl.NavigationControl({showCompass:false}),'top-right');if(config.showUserLocation){new mapboxgl.Marker({element:Object.assign(document.createElement('div'),{className:'user'})}).setLngLat(config.center).addTo(map)}config.markers.forEach(item=>{const el=document.createElement('button');el.className='marker '+item.kind;el.title=item.title;el.innerHTML='<span>'+(item.kind==='restaurant'?'♜':item.kind==='spa'?'✦':item.kind==='event'?'★':'•')+'</span>';el.onclick=()=>window.ReactNativeWebView.postMessage(JSON.stringify({type:'marker',id:item.id}));new mapboxgl.Marker({element:el,anchor:'bottom'}).setLngLat([item.longitude,item.latitude]).addTo(map)});if(config.route.length>1){map.on('load',()=>{map.addSource('route',{type:'geojson',data:{type:'Feature',properties:{},geometry:{type:'LineString',coordinates:config.route}}});map.addLayer({id:'route',type:'line',source:'route',paint:{'line-color':'#2563eb','line-width':5,'line-cap':'round','line-join':'round'}})})}</script></body></html>`;
  }, [center.latitude, center.longitude, markers, routeCoordinates, showUserLocation, zoomLevel]);

  if (!MAPBOX_TOKEN || mapError) {
    return <View style={[styles.container, styles.unavailable, height != null && { height }]}><Text style={styles.errorText}>{mapError || "Mapbox access token is not configured."}</Text></View>;
  }

  return (
    <View style={[styles.container, height != null && { height }]}>
      <WebView
        originWhitelist={["*"]}
        source={{ html: mapHtml }}
        style={styles.map}
        javaScriptEnabled
        domStorageEnabled
        startInLoadingState
        onError={() => setMapError("Mapbox could not load the map.")}
        onHttpError={() => setMapError("Mapbox returned an error while loading the map.")}
        onMessage={(event) => {
          try {
            const message = JSON.parse(event.nativeEvent.data);
            if (message.type === "error") setMapError(message.message);
            if (message.type === "marker") markers.find((marker) => marker.id === message.id)?.onPress?.();
          } catch {
            // Ignore malformed messages from the map document.
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: "100%", height: "100%", overflow: "hidden", backgroundColor: "#dbeafe" },
  map: { flex: 1 },
  unavailable: { alignItems: "center", justifyContent: "center", padding: 16 },
  errorText: { color: "#475569", fontSize: 12, fontWeight: "600", textAlign: "center" },
});
