import { useNavigation } from "@react-navigation/native";
import { FlatList, StyleSheet, Text, View } from "react-native";

import { RestaurantCard } from "@/components/cards/RestaurantCard";
import { IconButton } from "@/components/common/IconButton";
import { LogoBadge } from "@/components/common/LogoBadge";
import { Screen } from "@/components/common/Screen";
import { restaurants } from "@/data/mock/restaurants";
import { useFavoriteStore } from "@/store/favoriteStore";
import { colors, typography } from "@/theme";

export function BookmarksScreen() {
  const navigation = useNavigation<any>();
  const ids = useFavoriteStore((state) => state.restaurantIds);
  const items = restaurants.filter((restaurant) => ids.includes(restaurant.id));

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
      {items.length === 0 ? (
        <Text style={styles.empty}>No saved restaurants yet.</Text>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <RestaurantCard
              restaurant={item}
              onPress={() =>
                navigation.navigate(
                  "RestaurantDetails" as never,
                  { restaurantId: item.id } as never,
                )
              }
            />
          )}
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
  },
  title: { ...typography.h2, color: colors.primaryDark },
  titleRow: { alignItems: "center", flexDirection: "row", gap: 10 },
  spacer: { width: 44 },
  list: { padding: 16, paddingBottom: 110 },
  empty: { color: colors.textSecondary, fontSize: 16, padding: 24 },
});
