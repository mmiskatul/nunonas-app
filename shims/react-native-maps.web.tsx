// @ts-nocheck
const React = require("react");
const { forwardRef, useImperativeHandle } = React;
const { View, Text, StyleSheet } = require("react-native");

const MapView = forwardRef(function MapView({ children, style }, ref) {
  useImperativeHandle(ref, () => ({
    animateToRegion() {},
    fitToCoordinates() {},
  }));

  return (
    <View style={[styles.map, style]}>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>Map preview unavailable on web</Text>
      </View>
      {children}
    </View>
  );
});

function Marker({ children }) {
  return <View pointerEvents="none">{children}</View>;
}

function Polyline() {
  return null;
}

const PROVIDER_GOOGLE = "google";

const styles = StyleSheet.create({
  map: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#dbeafe",
    overflow: "hidden",
  },
  badge: {
    position: "absolute",
    top: 12,
    alignSelf: "center",
    backgroundColor: "rgba(15, 23, 42, 0.82)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    zIndex: 1,
  },
  badgeText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "700",
  },
});

module.exports = MapView;
module.exports.default = MapView;
module.exports.Marker = Marker;
module.exports.Polyline = Polyline;
module.exports.PROVIDER_GOOGLE = PROVIDER_GOOGLE;


