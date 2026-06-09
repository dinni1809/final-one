import { DrawerActions, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Feather } from "@expo/vector-icons";

import { RestaurantCard } from "@/components/cards/RestaurantCard";
import { IconButton } from "@/components/common/IconButton";
import { LogoBadge } from "@/components/common/LogoBadge";
import { Screen } from "@/components/common/Screen";
import { FilterDropdown } from "@/components/forms/FilterDropdown";
import { useRestaurants } from "@/hooks/useRestaurants";
import { useRestaurantFilters } from "@/hooks/useRestaurantFilters";
import { useFilterStore } from "@/store/filterStore";
import { colors, radius, shadows, typography } from "@/theme";
import type { DiscoverStackParamList } from "@/types/navigation";
import type { Restaurant } from "@/types/restaurant";
import {
  splitAndNormalizeValues,
  splitCommaSeparatedValues,
} from "@/utils/filterOptions";
import { printDiscoverAuditReport } from "@/utils/discoverAudit";

type Nav = NativeStackNavigationProp<DiscoverStackParamList>;

const sortLabels = {
  recommended: "Recommended",
  rating: "Rating",
  popular: "Popular",
};

export function DiscoverScreen() {
  const navigation = useNavigation<Nav>();
  const rootNavigation = useNavigation();
  const [openFilter, setOpenFilter] = useState<string | null>(null);
  const [openSort, setOpenSort] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const filters = useFilterStore((state) => state.filters);
  const setFilter = useFilterStore((state) => state.setFilter);
  const clearFilters = useFilterStore((state) => state.clearFilters);

  // Default sort to "recommended" if not set
  useEffect(() => {
    if (!filters.sort) {
      setFilter("sort", "recommended");
    }
  }, [filters.sort]);

  const { data: restaurants = [] } = useRestaurants(filters);
  const {
    data: filterOptions = {
      areas: [],
      cuisines: [],
      styles: [],
      prices: ["Budget", "Mid", "Premium", "Luxury"],
    },
  } = useRestaurantFilters();

  const menuOptions = useMemo(
    () => ["Biryani", "Pizza", "Burger", "Pasta", "Desserts", "Coffee"],
    [],
  );

  const dropdownOptions = useMemo(
    () => ({
      area: splitAndNormalizeValues(filterOptions.areas, "area"),
      price: splitCommaSeparatedValues(filterOptions.prices),
      menuItem: splitAndNormalizeValues(menuOptions, "menuItem"),
      cuisine: splitAndNormalizeValues(filterOptions.cuisines, "cuisine"),
      style: splitAndNormalizeValues(filterOptions.styles, "style"),
    }),
    [filterOptions, menuOptions],
  );

  useEffect(() => {
    if (restaurants.length === 0) return;
    printDiscoverAuditReport(restaurants);

    // Part 4 debug logs requirement:
    console.log(`[Discover DEBUG] Total restaurants fetched: ${restaurants.length}`);
    const hsrCount = restaurants.filter((r: Restaurant) => r.area.toLowerCase().includes("hsr layout")).length;
    console.log(`[Discover DEBUG] ${restaurants.length} restaurants loaded, ${hsrCount} restaurants matched HSR Layout`);
  }, [restaurants]);

  const visibleRestaurants = showAll ? restaurants : restaurants.slice(0, 6);

  const isDropdownOrSortOpen = openFilter !== null || openSort;

  return (
    <Screen>
      <View style={styles.pressableContainer}>
        {/* Header Section */}
        <View style={styles.header}>
          <LogoBadge size={74} />
          <View style={styles.headerIcons}>
            <IconButton
              name="heart"
              size={25}
              onPress={() => rootNavigation.navigate("Bookmarks" as never)}
            />
            <IconButton
              name="user"
              size={25}
              onPress={() => rootNavigation.navigate("Profile" as never)}
            />
            <IconButton
              name="menu"
              size={27}
              onPress={() =>
                rootNavigation.dispatch(DrawerActions.openDrawer())
              }
            />
          </View>
        </View>

        {/* Caption banner - matching mockup divider script styling */}
        <View style={styles.captionContainer}>
          <View style={styles.captionLine} />
          <Text style={styles.captionSymbol}>✦</Text>
          <Text style={styles.captionText}>Discover restaurants curated for great experiences.</Text>
          <Text style={styles.captionSymbol}>✦</Text>
          <View style={styles.captionLine} />
        </View>

        {/* Filters Grid Section (2 columns) */}
        <View style={styles.filterGrid}>
          <View style={[styles.filterItem, openFilter === "area" ? styles.filterItemOpen : styles.filterItemClosed]}>
            <FilterDropdown
              label="Area"
              value={filters.area}
              placeholder="Select area"
              options={dropdownOptions.area}
              open={openFilter === "area"}
              onOpen={() => setOpenFilter(openFilter === "area" ? null : "area")}
              onClose={() => setOpenFilter(null)}
              onSelect={(value) => {
                setFilter("area", value as never);
                setOpenFilter(null);
              }}
              iconName="map-pin"
            />
          </View>
          <View style={[styles.filterItem, openFilter === "cuisine" ? styles.filterItemOpen : styles.filterItemClosed]}>
            <FilterDropdown
              label="Cuisine"
              value={filters.cuisine}
              placeholder="Select cuisine"
              options={dropdownOptions.cuisine}
              open={openFilter === "cuisine"}
              onOpen={() => setOpenFilter(openFilter === "cuisine" ? null : "cuisine")}
              onClose={() => setOpenFilter(null)}
              onSelect={(value) => {
                setFilter("cuisine", value as never);
                setOpenFilter(null);
              }}
              iconName="coffee"
            />
          </View>
          <View style={[styles.filterItem, openFilter === "price" ? styles.filterItemOpen : styles.filterItemClosed]}>
            <FilterDropdown
              label="Price"
              value={filters.price}
              placeholder="Select price"
              options={dropdownOptions.price}
              open={openFilter === "price"}
              onOpen={() => setOpenFilter(openFilter === "price" ? null : "price")}
              onClose={() => setOpenFilter(null)}
              onSelect={(value) => {
                setFilter("price", value as never);
                setOpenFilter(null);
              }}
              iconText="₹"
            />
          </View>
          <View style={[styles.filterItem, openFilter === "style" ? styles.filterItemOpen : styles.filterItemClosed]}>
            <FilterDropdown
              label="Type of Restaurant"
              value={filters.style}
              placeholder="All Types"
              options={dropdownOptions.style}
              open={openFilter === "style"}
              onOpen={() => setOpenFilter(openFilter === "style" ? null : "style")}
              onClose={() => setOpenFilter(null)}
              onSelect={(value) => {
                setFilter("style", value as never);
                setOpenFilter(null);
              }}
              iconName="home"
            />
          </View>
          <View style={[styles.filterItem, openFilter === "menuItem" ? styles.filterItemOpen : styles.filterItemClosed]}>
            <FilterDropdown
              label="Menu Item"
              value={filters.menuItem}
              placeholder="Select item"
              options={dropdownOptions.menuItem}
              open={openFilter === "menuItem"}
              onOpen={() => setOpenFilter(openFilter === "menuItem" ? null : "menuItem")}
              onClose={() => setOpenFilter(null)}
              onSelect={(value) => {
                setFilter("menuItem", value as never);
                setOpenFilter(null);
              }}
              iconName="book-open"
            />
          </View>
          <View style={[styles.filterItem, openFilter === "rating" ? styles.filterItemOpen : styles.filterItemClosed]}>
            <FilterDropdown
              label="Rating"
              value={filters.rating}
              placeholder="Any rating"
              options={["Any rating", "3.0+", "4.0+", "4.5+"]}
              open={openFilter === "rating"}
              onOpen={() => setOpenFilter(openFilter === "rating" ? null : "rating")}
              onClose={() => setOpenFilter(null)}
              onSelect={(value) => {
                setFilter("rating", value === "Any rating" ? undefined : value);
                setOpenFilter(null);
              }}
              iconName="star"
            />
          </View>
        </View>

        {/* Scrollable Restaurant Cards & Sort */}
        <ScrollView
          style={[styles.scrollContainer, openSort ? { zIndex: 100 } : { zIndex: 0 }]}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Results Header (Count + Sort) */}
          <View style={styles.resultsHeader}>
            <View style={styles.resultsCountRow}>
              <Feather name="grid" size={15} color={colors.textSecondary} />
              <Text style={styles.resultsCountText}>
                {restaurants.length} {restaurants.length === 1 ? "restaurant" : "restaurants"} found
              </Text>
            </View>
            <View style={styles.sortWrapper}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setOpenSort(!openSort)}
                style={styles.sortButton}
              >
                <Feather name="sliders" size={12} color={colors.primaryDark} />
                <Text style={styles.sortButtonText}>
                  Sort: {sortLabels[filters.sort as keyof typeof sortLabels] ?? "Recommended"}
                </Text>
                <Feather name="chevron-down" size={12} color={colors.primaryDark} />
              </TouchableOpacity>

              {openSort && (
                <View style={styles.sortDropdown}>
                  {(Object.keys(sortLabels) as Array<keyof typeof sortLabels>).map((key) => (
                    <TouchableOpacity
                      key={key}
                      style={[
                        styles.sortDropdownItem,
                        filters.sort === key && styles.sortDropdownItemActive,
                      ]}
                      onPress={() => {
                        setFilter("sort", key);
                        setOpenSort(false);
                      }}
                    >
                      <Text
                        style={[
                          styles.sortDropdownItemText,
                          filters.sort === key && styles.sortDropdownItemTextActive,
                        ]}
                      >
                        {sortLabels[key]}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </View>

          {/* Restaurants Grid List */}
          {restaurants.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Feather name="search" size={40} color={colors.textSecondary} />
              <Text style={styles.emptyTitle}>No Restaurants Found</Text>
              <Text style={styles.emptySubtitle}>
                Try clearing or adjusting your filters to discover other dining spots.
              </Text>
              <TouchableOpacity
                style={styles.clearBtn}
                activeOpacity={0.8}
                onPress={() => clearFilters()}
              >
                <Text style={styles.clearBtnText}>Clear Filters</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.gridContainer}>
              {visibleRestaurants.map((item: Restaurant) => (
                <RestaurantCard
                  key={item.id}
                  restaurant={item}
                  compact
                  style={styles.gridCard}
                  onPress={() =>
                    navigation.navigate("RestaurantDetails", {
                      restaurantId: item.id,
                    })
                  }
                />
              ))}
            </View>
          )}

          {/* Show More Button (matches mockup) */}
          {restaurants.length > 6 && !showAll && (
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.showMoreButton}
              onPress={() => setShowAll(true)}
            >
              <Text style={styles.showMoreBtnText}>Show More</Text>
              <Feather name="chevron-down" size={14} color={colors.primaryDark} />
            </TouchableOpacity>
          )}
        </ScrollView>

        {isDropdownOrSortOpen && (
          <Pressable
            style={styles.backdrop}
            onPress={() => {
              setOpenFilter(null);
              setOpenSort(false);
            }}
          />
        )}
      </View>
      <LinearGradient
        colors={["rgba(255,255,255,0)", "#8B4E12"]}
        style={styles.bottomWave}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  pressableContainer: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 8,
    overflow: "visible",
  },
  scrollContainer: {
    flex: 1,
    zIndex: 0,
  },
  scrollContent: {
    paddingBottom: 130,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  headerIcons: {
    flexDirection: "row",
    gap: 8,
  },
  captionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 14,
    gap: 6,
    paddingHorizontal: 4,
  },
  captionLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
    opacity: 0.8,
  },
  captionSymbol: {
    fontSize: 10,
    color: colors.primary,
  },
  captionText: {
    fontSize: 12,
    fontFamily: "Georgia",
    fontWeight: "700",
    color: colors.primaryDark,
    textAlign: "center",
  },
  filterGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 8,
    marginTop: 2,
    zIndex: 100,
    overflow: "visible",
    position: "relative",
  },
  filterItem: {
    width: "48%",
    position: "relative",
    overflow: "visible",
    marginBottom: 8,
  },
  filterItemOpen: {
    zIndex: 9999,
    elevation: 30,
  },
  filterItemClosed: {
    zIndex: 1,
  },
  resultsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 18,
    marginBottom: 8,
    // Must be below filter grid in stacking order
    zIndex: 0,
  },
  resultsCountRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  resultsCountText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: "700",
  },
  sortWrapper: {
    position: "relative",
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.beigeSoft,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.sm,
    paddingVertical: 6,
    paddingHorizontal: 10,
    gap: 6,
    ...shadows.soft,
  },
  sortButtonText: {
    fontSize: 12,
    fontWeight: "800",
    color: colors.primaryDark,
  },
  sortDropdown: {
    position: "absolute",
    top: 36,
    right: 0,
    backgroundColor: "#FAF6EE",
    borderColor: "#D6A36E",
    borderWidth: 1,
    borderRadius: radius.sm,
    width: 140,
    ...shadows.card,
    zIndex: 9999,
    elevation: 20,
    paddingVertical: 4,
  },
  sortDropdownItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  sortDropdownItemActive: {
    backgroundColor: "#EADDC9",
  },
  sortDropdownItemText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#4A2C1A",
  },
  sortDropdownItemTextActive: {
    color: "#8B4E12",
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 4,
    // Explicitly below filter dropdowns
    zIndex: 0,
  },
  gridCard: {
    width: "48.5%",
    marginRight: 0,
    marginBottom: 10,
    zIndex: 0,
  },
  showMoreButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.beigeSoft,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingVertical: 12,
    marginTop: 12,
    gap: 6,
    ...shadows.soft,
  },
  showMoreBtnText: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.primaryDark,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.beigeSoft,
    borderRadius: radius.md,
    paddingVertical: 44,
    paddingHorizontal: 20,
    marginTop: 8,
    borderColor: colors.border,
    borderWidth: 1,
    ...shadows.soft,
    gap: 8,
    width: "100%",
  },
  emptyTitle: {
    color: colors.primaryDark,
    fontFamily: "Georgia",
    fontSize: 16,
    fontWeight: "700",
  },
  emptySubtitle: {
    color: colors.textSecondary,
    fontSize: 13,
    textAlign: "center",
    lineHeight: 18,
    marginBottom: 8,
  },
  clearBtn: {
    backgroundColor: colors.primaryDark,
    borderRadius: radius.sm,
    paddingVertical: 8,
    paddingHorizontal: 16,
    ...shadows.soft,
  },
  clearBtnText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: "800",
  },
  bottomWave: {
    bottom: -50,
    height: 118,
    position: "absolute",
    right: -36,
    transform: [{ rotate: "-5deg" }],
    width: 360,
    zIndex: -1,
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 90,
    backgroundColor: "transparent",
  },
});
