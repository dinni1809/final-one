import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Image } from "expo-image";
import { useEffect } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { IconButton } from "@/components/common/IconButton";
import { LogoBadge } from "@/components/common/LogoBadge";
import { Screen } from "@/components/common/Screen";
import { useFavoriteStore } from "@/store/favoriteStore";
import { colors, radius, shadows, typography } from "@/theme";
import { formatPriceLevel } from "@/utils/format";
import { normalizeCuisineValues } from "@/utils/filterOptions";

export function BookmarksScreen() {
  const navigation = useNavigation<any>();
  const restaurants = useFavoriteStore((state) => state.restaurants);
  const loadFavorites = useFavoriteStore((state) => state.loadFavorites);
  const toggleRestaurant = useFavoriteStore((state) => state.toggleRestaurant);

  useEffect(() => {
    void loadFavorites();
  }, [loadFavorites]);

  const handleDiscoverPress = () => {
    try {
      navigation.navigate("Discover");
    } catch {
      navigation.navigate("Tabs", { screen: "Discover" });
    }
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.heartCircle}>
        <Feather name="heart" size={56} color={colors.primary} />
      </View>
      <Text style={styles.emptyTitle}>No saved restaurants yet</Text>
      <Text style={styles.emptySubtitle}>
        Start exploring and save your favorite dining spots.
      </Text>
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.discoverBtn}
        onPress={handleDiscoverPress}
      >
        <Text style={styles.discoverBtnText}>Discover Restaurants</Text>
        <Feather name="compass" size={16} color={colors.white} />
      </TouchableOpacity>
    </View>
  );

  return (
    <Screen>
      <View style={styles.header}>
        <IconButton name="chevron-left" onPress={() => navigation.goBack()} />
        <View style={styles.titleRow}>
          <LogoBadge size={48} />
          <Text style={styles.title}>Saved Favorites</Text>
        </View>
        <View style={styles.spacer} />
      </View>

      {restaurants.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={restaurants}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const cuisines = normalizeCuisineValues(item.cuisines);
            const cuisineLabel = cuisines.length > 0 ? cuisines.join(", ") : "Cuisine unavailable";
            const locationLabel = [item.area, item.city].filter(Boolean).join(", ");
            const priceLabel = formatPriceLevel(item.priceLevel);

            return (
              <View style={styles.card}>
                <View style={styles.imageContainer}>
                  <Image source={{ uri: item.image }} style={styles.cardImage} contentFit="cover" />
                  <View style={styles.ratingBadge}>
                    <Feather name="star" size={12} color={colors.primaryDark} />
                    <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
                  </View>
                </View>

                <View style={styles.cardBody}>
                  <Text style={styles.cardName} numberOfLines={1}>{item.name}</Text>
                  <Text style={styles.cardCuisine} numberOfLines={1}>{cuisineLabel}</Text>
                  
                  <View style={styles.metaRow}>
                    <View style={styles.location}>
                      <Feather name="map-pin" size={12} color={colors.textSecondary} />
                      <Text style={styles.locationText} numberOfLines={1}>{locationLabel}</Text>
                    </View>
                    <Text style={styles.priceText}>{priceLabel}</Text>
                  </View>
                </View>

                <View style={styles.cardActions}>
                  <TouchableOpacity
                    style={styles.removeBtn}
                    activeOpacity={0.75}
                    onPress={() => toggleRestaurant(item.id)}
                  >
                    <Feather name="trash-2" size={14} color={colors.danger} />
                    <Text style={styles.removeText}>Remove</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.openBtn}
                    activeOpacity={0.75}
                    onPress={() =>
                      navigation.navigate("RestaurantDetails" as never, {
                        restaurantId: item.id,
                      } as never)
                    }
                  >
                    <Text style={styles.openText}>Open Restaurant</Text>
                    <Feather name="arrow-right" size={14} color={colors.white} />
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.background,
  },
  title: { ...typography.h2, color: colors.primaryDark },
  titleRow: { alignItems: "center", flexDirection: "row", gap: 10 },
  spacer: { width: 44 },
  list: { padding: 16, paddingBottom: 110 },
  
  // Empty State Styles
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    gap: 16,
  },
  heartCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.beige,
    alignItems: "center",
    justifyContent: "center",
    ...shadows.soft,
    marginBottom: 8,
  },
  emptyTitle: {
    color: colors.primaryDark,
    fontFamily: "Georgia",
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
  },
  emptySubtitle: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 12,
  },
  discoverBtn: {
    backgroundColor: colors.primaryDark,
    borderRadius: radius.md,
    paddingVertical: 14,
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 8,
    ...shadows.button,
  },
  discoverBtnText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "800",
  },

  // Card Styles
  card: {
    backgroundColor: colors.beigeSoft,
    borderRadius: radius.md,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
    ...shadows.card,
  },
  imageContainer: {
    height: 160,
    width: "100%",
    position: "relative",
  },
  cardImage: {
    width: "100%",
    height: "100%",
  },
  ratingBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: colors.beigeSoft,
    borderRadius: radius.pill,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    ...shadows.soft,
  },
  ratingText: {
    color: colors.primaryDark,
    fontSize: 12,
    fontWeight: "800",
  },
  cardBody: {
    padding: 16,
    gap: 6,
  },
  cardName: {
    color: colors.text,
    fontFamily: "Georgia",
    fontSize: 20,
    fontWeight: "700",
  },
  cardCuisine: {
    color: colors.textSecondary,
    fontSize: 13,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 2,
  },
  location: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    flex: 1,
    marginRight: 12,
  },
  locationText: {
    color: colors.textSecondary,
    fontSize: 13,
    flex: 1,
  },
  priceText: {
    color: colors.primaryDark,
    fontSize: 14,
    fontWeight: "800",
  },
  cardActions: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: colors.border,
    padding: 12,
    gap: 12,
    backgroundColor: colors.beige,
  },
  removeBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingVertical: 10,
    backgroundColor: colors.beigeSoft,
  },
  removeText: {
    color: colors.danger,
    fontSize: 13,
    fontWeight: "700",
  },
  openBtn: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: colors.primaryDark,
    borderRadius: radius.sm,
    paddingVertical: 10,
    ...shadows.button,
  },
  openText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: "700",
  },
});
