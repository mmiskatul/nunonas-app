const googleMapsApiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || "";
const googleMapsAndroidApiKey =
  process.env.GOOGLE_MAPS_ANDROID_API_KEY || googleMapsApiKey;
const googleMapsIosApiKey =
  process.env.GOOGLE_MAPS_IOS_API_KEY || googleMapsApiKey;

export default {
  expo: {
    name: "Activity Planner",
    slug: "activity-planner",
    scheme: "nuno-app",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.nuno.activityplanner",
      config: {
        googleMapsApiKey: googleMapsIosApiKey,
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      edgeToEdgeEnabled: true,
      package: "com.nuno.activityplanner",
      config: {
        googleMaps: {
          apiKey: googleMapsAndroidApiKey,
        },
      },
      permissions: [
        "android.permission.ACCESS_COARSE_LOCATION",
        "android.permission.ACCESS_FINE_LOCATION",
      ],
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    plugins: [
      "expo-router",
      "@rnmapbox/maps",
      [
        "expo-location",
        {
          locationWhenInUsePermission:
            "Allow Activity Planner to use your location during signup to personalize nearby recommendations.",
        },
      ],
    ],
    extra: {
      router: {},
      eas: {
        projectId: "315819ed-4fd0-470a-a393-a3703e796337",
      },
    },
  },
};
