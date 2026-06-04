import { Feather } from "@expo/vector-icons";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";

import { RestaurantCard } from "@/components/cards/RestaurantCard";
import { IconButton } from "@/components/common/IconButton";
import { Screen } from "@/components/common/Screen";
import { TRENDING_CATEGORIES } from "@/data/trendingCategories";
import { useRestaurants } from "@/hooks/useRestaurants";
import { colors, radius, typography } from "@/theme";
import type { TrendingStackParamList } from "@/types/navigation";
import type { Restaurant } from "@/types/restaurant";

type CategoryRoute = RouteProp<TrendingStackParamList, "TrendingCategory">;

export function TrendingCategoryScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<CategoryRoute>();
  const { categoryId, categoryName } = route.params;

  const category = TRENDING_CATEGORIES.find((c) => c.id === categoryId);
  const { data: restaurants = [], isLoading } = useRestaurants();

  // Filter restaurants mapping to this category
  const mappedRestaurants = (restaurants as Restaurant[]).filter((r: Restaurant) =>
    category?.restaurantNames.some((name) =>
      r.name.toLowerCase().includes(name.toLowerCase())
    )
  );

  return (
    <Screen>
      <View style={styles.header}>
        <IconButton name="chevron-left" onPress={() => navigation.goBack()} />
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{categoryName}</Text>
          <Text style={styles.subtitle}>{category?.subtitle ?? "Hand-picked by FAATTSOO"}</Text>
        </View>
        <View style={styles.spacer} />
      </View>

      <View style={styles.descCard}>
        <Text style={styles.descText}>{category?.description}</Text>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Fetching dining collection...</Text>
        </View>
      ) : mappedRestaurants.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Feather name="info" size={32} color={colors.textSecondary} />
          <Text style={styles.emptyTitle}>Collection Coming Soon</Text>
          <Text style={styles.emptySub}>
            We are currently hand-picking the top restaurants for this collection.
          </Text>
        </View>
      ) : (
        <FlatList
          data={mappedRestaurants}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.list}
          columnWrapperStyle={styles.columns}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <RestaurantCard
              restaurant={item}
              compact
              onPress={() =>
                navigation.navigate("RestaurantDetails" as never, {
                  restaurantId: item.id,
                } as never)
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
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.background,
  },
  titleContainer: {
    alignItems: "center",
    flex: 1,
  },
  title: {
    ...typography.h2,
    color: colors.primaryDark,
    textAlign: "center",
  },
  subtitle: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    marginTop: 2,
  },
  spacer: {
    width: 44,
  },
  descCard: {
    backgroundColor: colors.beigeSoft,
    borderRadius: radius.md,
    padding: 14,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  descText: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  loadingText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    gap: 8,
  },
  emptyTitle: {
    color: colors.primaryDark,
    fontSize: 18,
    fontWeight: "700",
    fontFamily: "Georgia",
    marginTop: 4,
  },
  emptySub: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  list: {
    padding: 16,
    paddingBottom: 48,
  },
  columns: {
    gap: 12,
    marginBottom: 14,
  },
});
