import type { Href } from "expo-router";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import theme from "../../../constants/theme";
import { listCategories } from "../../../lib/customer-api";
import { DiningIcon, HotelIcon, SpaIcon } from "../../ui/SVGIcons";

function EventsQuickAccessIcon({ width = 18, height = 20, color }: { width?: number; height?: number; color?: string }) {
  return <MaterialIcons name="emoji-events" size={Math.max(width, height)} color={color || "#A855F7"} />;
}

type CategoryKey = "restaurant" | "event" | "spa" | "hotel";

type CategoryCountItem = {
  key?: string | null;
  count?: number | string | null;
};

type CategoryCountResponse = {
  items?: CategoryCountItem[];
  data?: CategoryCountItem[];
};

type QuickAccessCategory = {
  key: CategoryKey;
  name: string;
  Icon: React.ComponentType<{ width?: number; height?: number }>;
  color: string;
  route: Href;
};

const CATEGORIES: QuickAccessCategory[] = [
  {
    key: "restaurant",
    name: "Dining",
    Icon: DiningIcon,
    color: "#fff7ed",
    route: "/home/dining",
  },
  {
    key: "event",
    name: "Events",
    Icon: EventsQuickAccessIcon,
    color: "#f5f3ff",
    route: "/home/events",
  },
  {
    key: "spa",
    name: "Spa",
    Icon: SpaIcon,
    color: "#fff1f2",
    route: "/home/spa",
  },
  {
    key: "hotel",
    name: "Hotels",
    Icon: HotelIcon,
    color: "#f0f9ff",
    route: "/home/hotels",
  },
];

const INITIAL_COUNTS: Record<CategoryKey, number | null> = {
  restaurant: null,
  event: null,
  spa: null,
  hotel: null,
};

function formatCount(category: CategoryKey, count: number | null) {
  if (count == null) {
    return "Explore";
  }
  if (category === "event") {
    return `${count} ${count === 1 ? "event" : "events"}`;
  }
  return `${count} ${count === 1 ? "place" : "places"}`;
}

export default function QuickAccess() {
  const router = useRouter();
  const [counts, setCounts] = useState(INITIAL_COUNTS);

  useEffect(() => {
    let active = true;

    async function loadCategoryCounts() {
      try {
        const response = await listCategories<CategoryCountResponse>();
        if (!active) {
          return;
        }
        const items = Array.isArray(response?.items)
          ? response.items
          : Array.isArray(response?.data)
            ? response.data
            : [];
        const nextCounts = { ...INITIAL_COUNTS };
        for (const item of items) {
          const key = String(item.key ?? "").trim().toLowerCase() as CategoryKey;
          if (!(key in nextCounts)) {
            continue;
          }
          const count = Number(item.count);
          nextCounts[key] = Number.isFinite(count) ? Math.max(0, count) : 0;
        }
        setCounts(nextCounts);
      } catch {
        // Keep every shortcut usable even if the count request is unavailable.
      }
    }

    void loadCategoryCounts();
    return () => {
      active = false;
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Quick Access</Text>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Browse all categories"
          activeOpacity={0.7}
          onPress={() => router.push("/search")}
        >
          <Text style={styles.browseText}>Browse all</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.list}>
        {CATEGORIES.map((category) => {
          const IconComponent = category.Icon;
          const countLabel = formatCount(category.key, counts[category.key]);
          return (
            <TouchableOpacity
              key={category.key}
              style={styles.item}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel={`${category.name}, ${countLabel}`}
              onPress={() => router.push(category.route)}
            >
              <View style={[styles.iconBox, { backgroundColor: category.color }]}>
                <IconComponent width={24} height={24} />
              </View>
              <Text style={styles.name}>{category.name}</Text>
              <Text style={styles.count}>{countLabel}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginTop: 25,
  },
  header: {
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: theme.COLORS.textPrimary,
  },
  browseText: {
    color: theme.COLORS.primary,
    fontSize: 13,
    fontWeight: "700",
  },
  list: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  item: {
    flex: 1,
    minWidth: 0,
    alignItems: "center",
    paddingVertical: 8,
    borderRadius: 18,
  },
  iconBox: {
    width: 60,
    height: 60,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  name: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: "700",
    color: theme.COLORS.textPrimary,
  },
  count: {
    marginTop: 2,
    fontSize: 10,
    fontWeight: "500",
    color: theme.COLORS.textSecondary,
  },
});
