import { DrawerActions, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import { useMemo, useState } from "react";
import { FlatList, ScrollView, StyleSheet, Text, View } from "react-native";

import { RestaurantCard } from "@/components/cards/RestaurantCard";
import { DecorativeDivider } from "@/components/common/DecorativeDivider";
import { IconButton } from "@/components/common/IconButton";
import { LogoBadge } from "@/components/common/LogoBadge";
import { Screen } from "@/components/common/Screen";
import { SectionHeader } from "@/components/common/SectionHeader";
import { FilterDropdown } from "@/components/forms/FilterDropdown";
import { useRestaurants } from "@/hooks/useRestaurants";
import { useFilterStore } from "@/store/filterStore";
import { restaurants as mockRestaurants } from "@/data/mock/restaurants";
import { colors, radius, shadows, typography } from "@/theme";
import type { DiscoverStackParamList } from "@/types/navigation";
import type { Restaurant } from "@/types/restaurant";

type Nav = NativeStackNavigationProp<DiscoverStackParamList>;

export function DiscoverScreen() {
  const navigation = useNavigation<Nav>();
  const rootNavigation = useNavigation();
  const [openFilter, setOpenFilter] = useState<string | null>(null);
  const filters = useFilterStore((state) => state.filters);
  const setFilter = useFilterStore((state) => state.setFilter);
  const { data: restaurants = [] } = useRestaurants(filters);
  const { data: allRestaurants = [] } = useRestaurants();

  const filterOptions = useMemo(
    () => {
      const source: Restaurant[] = allRestaurants.length > 0 ? allRestaurants : mockRestaurants;
      return {
      area: Array.from(new Set(source.map((item) => item.area))).sort(),
      price: ["Budget", "Mid", "Premium", "Luxury"],
      menuItem: ["Biryani", "Pizza", "Burger", "Pasta", "Desserts", "Coffee"],
      cuisine: Array.from(new Set(source.flatMap((item) => item.cuisines))).sort(),
      style: Array.from(new Set(source.map((item) => item.style))).sort(),
      };
    },
    [allRestaurants],
  );

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <LogoBadge size={82} />
          <View style={styles.headerIcons}>
            <IconButton
              name="heart"
              size={27}
              onPress={() => rootNavigation.navigate("Bookmarks" as never)}
            />
            <IconButton
              name="user"
              size={27}
              onPress={() => rootNavigation.navigate("Profile" as never)}
            />
            <IconButton
              name="menu"
              size={29}
              onPress={() =>
                rootNavigation.dispatch(DrawerActions.openDrawer())
              }
            />
          </View>
        </View>

        <View style={styles.heroSketch} />
        <Text style={styles.title}>Discover Restaurants</Text>
        <DecorativeDivider />
        <Text style={styles.subtitle}>Curated places. Great experiences.</Text>

        <View style={styles.filterPanel}>
          <FilterDropdown
            label="Area"
            value={filters.area}
            placeholder="Select area"
            options={filterOptions.area}
            open={openFilter === "area"}
            onOpen={() => setOpenFilter("area")}
            onClose={() => setOpenFilter(null)}
            onSelect={(value) => {
              setFilter("area", value as never);
              setOpenFilter(null);
            }}
          />
          <FilterDropdown
            label="Price"
            value={filters.price}
            placeholder="Select price"
            options={filterOptions.price}
            open={openFilter === "price"}
            onOpen={() => setOpenFilter("price")}
            onClose={() => setOpenFilter(null)}
            onSelect={(value) => {
              setFilter("price", value as never);
              setOpenFilter(null);
            }}
          />
          <FilterDropdown
            label="Menu item"
            value={filters.menuItem}
            placeholder="Select item"
            options={filterOptions.menuItem}
            open={openFilter === "menuItem"}
            onOpen={() => setOpenFilter("menuItem")}
            onClose={() => setOpenFilter(null)}
            onSelect={(value) => {
              setFilter("menuItem", value as never);
              setOpenFilter(null);
            }}
          />
          <FilterDropdown
            label="Cuisine"
            value={filters.cuisine}
            placeholder="Select cuisine"
            options={filterOptions.cuisine}
            open={openFilter === "cuisine"}
            onOpen={() => setOpenFilter("cuisine")}
            onClose={() => setOpenFilter(null)}
            onSelect={(value) => {
              setFilter("cuisine", value as never);
              setOpenFilter(null);
            }}
          />
          <FilterDropdown
            label="Type"
            value={filters.style}
            placeholder="Select type"
            options={filterOptions.style}
            open={openFilter === "style"}
            onOpen={() => setOpenFilter("style")}
            onClose={() => setOpenFilter(null)}
            onSelect={(value) => {
              setFilter("style", value as never);
              setOpenFilter(null);
            }}
          />
        </View>

        <View style={styles.tables}>
          <SectionHeader
            title="Top Tables This Week"
            onViewAll={() => navigation.navigate("RestaurantList")}
          />
          <Text style={styles.sectionCopy}>
            Handpicked restaurants for memorable dining experiences.
          </Text>
          {restaurants.length === 0 ? (
            <Text style={styles.empty}>No restaurants found. Try changing a dropdown.</Text>
          ) : (
            <FlatList
              data={restaurants.slice(0, 8)}
              horizontal
              keyExtractor={(item) => item.id}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.list}
              renderItem={({ item }) => (
                <RestaurantCard
                  restaurant={item}
                  onPress={() =>
                    navigation.navigate("RestaurantDetails", {
                      restaurantId: item.id,
                    })
                  }
                />
              )}
            />
          )}
        </View>
      </ScrollView>
      <LinearGradient
        colors={["rgba(255,255,255,0)", "#8B4E12"]}
        style={styles.bottomWave}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 120,
    paddingHorizontal: 14,
    paddingTop: 12,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  headerIcons: {
    flexDirection: "row",
    gap: 8,
  },
  heroSketch: {
    borderColor: "#D6A36E",
    borderWidth: 1,
    height: 150,
    opacity: 0.22,
    position: "absolute",
    right: 0,
    top: 112,
    width: 160,
  },
  title: {
    ...typography.display,
    color: colors.primaryDark,
    marginTop: 40,
  },
  subtitle: {
    color: colors.primaryDark,
    fontFamily: "Georgia",
    fontSize: 22,
    marginTop: 22,
  },
  filterPanel: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 34,
  },
  tables: {
    backgroundColor: "rgba(255,255,255,0.44)",
    borderRadius: radius.lg,
    marginTop: 26,
    padding: 16,
    ...shadows.soft,
  },
  sectionCopy: {
    color: colors.textSecondary,
    fontSize: 14,
    marginBottom: 18,
  },
  list: {
    paddingBottom: 4,
  },
  empty: {
    color: colors.textSecondary,
    fontSize: 14,
    paddingVertical: 18,
  },
  bottomWave: {
    bottom: -50,
    height: 118,
    position: "absolute",
    right: -36,
    transform: [{ rotate: "-5deg" }],
    width: 360,
  },
});
