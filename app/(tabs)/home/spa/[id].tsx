import React, { useEffect, useState } from "react";
import { StyleSheet, View, ScrollView, StatusBar, Text, ActivityIndicator } from "react-native";
import { useLocalSearchParams } from "expo-router";
import theme from "../../../../constants/theme";
import { getFirstQueryParam } from "../../../../lib/event-map-utils";
import { getErrorMessage, normalizeSpa } from "../../../../lib/provider-utils";
import type { NormalizedSpa, ProviderCollectionResponse, ProviderPayload } from "../../../../lib/provider-types";
import { getSpa, getSpaGallery, getSpaMenu } from "../../../../lib/customer-api";

// Import Details Components
import SpaImageHeader from "../../../../components/tabs/home/spa/details/SpaImageHeader";
import SpaDetailsInfo from "../../../../components/tabs/home/spa/details/SpaDetailsInfo";
import SpaDetailsActions from "../../../../components/tabs/home/spa/details/SpaDetailsActions";
import SpaDetailsTabs from "../../../../components/tabs/home/spa/details/SpaDetailsTabs";
import SpaOverviewContent from "../../../../components/tabs/home/spa/details/SpaOverviewContent";
import SpaMenuContent from "../../../../components/tabs/home/spa/details/SpaMenuContent";
import SpaGalleryContent from "../../../../components/tabs/home/spa/details/SpaGalleryContent";
import ReviewsContent from "../../../../components/tabs/home/reviews/ReviewsContent";

export default function SpaDetailsScreen() {
  const { id } = useLocalSearchParams();
  const spaId = getFirstQueryParam(id);
  const [activeTab, setActiveTab] = useState("Overview");
  const [spa, setSpa] = useState<NormalizedSpa | null>(null);
  const [menuItems, setMenuItems] = useState<ProviderPayload[]>([]);
  const [galleryItems, setGalleryItems] = useState<ProviderPayload[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function fetchSpa() {
      if (!spaId) {
        setError("Spa not found.");
        setLoading(false);
        return;
      }

      try {
        const [detail, menu, gallery] = await Promise.all([
          getSpa<ProviderPayload>(spaId),
          getSpaMenu<ProviderCollectionResponse>(spaId),
          getSpaGallery<ProviderCollectionResponse>(spaId),
        ]);

        if (cancelled) {
          return;
        }

        setSpa(normalizeSpa(detail));
        setMenuItems(menu.items ?? []);
        setGalleryItems(gallery.items ?? []);
      } catch (error: unknown) {
        if (!cancelled) {
          setError(getErrorMessage(error, "Failed to load spa details."));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchSpa();

    return () => {
      cancelled = true;
    };
  }, [spaId]);

  if (loading) {
    return (
      <View style={styles.centerState}>
        <ActivityIndicator size="large" color={theme.COLORS.primary} />
      </View>
    );
  }

  if (error || !spa) {
    return (
      <View style={styles.centerState}>
        <Text style={styles.emptyText}>{error || "Spa not found."}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[3]}
      >
        <SpaImageHeader image={spa.imageUrl ? { uri: spa.imageUrl } : require("../../../../assets/images/spa/galley/Rectangle 2.png")} />
        <SpaDetailsInfo spa={spa} />

        <SpaDetailsActions />

        <SpaDetailsTabs activeTab={activeTab} onTabPress={setActiveTab} />

        {/* Tab Content */}
        <View style={styles.content}>
          {activeTab === "Overview" && <SpaOverviewContent />}
          {activeTab === "Menu" && <SpaMenuContent items={menuItems} />}
          {activeTab === "Gallery" && <SpaGalleryContent items={galleryItems} />}
          {activeTab === "Reviews" && spaId ? <ReviewsContent restaurantId={spaId} /> : null}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.COLORS.white,
  },
  content: {
    backgroundColor: theme.COLORS.white,
    paddingBottom: 40,
  },
  centerState: {
    flex: 1,
    backgroundColor: theme.COLORS.white,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.COLORS.textSecondary,
    textAlign: "center",
  },
});


