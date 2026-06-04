import { useNavigation } from "@react-navigation/native";
import { FlatList, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { RestaurantCard } from "@/components/cards/RestaurantCard";
import { LogoBadge } from "@/components/common/LogoBadge";
import { Screen } from "@/components/common/Screen";
import { TRENDING_CATEGORIES } from "@/data/trendingCategories";
import { useTrendingRestaurants } from "@/hooks/useHomeData";
import { colors, radius, shadows, typography } from "@/theme";

export function TrendingScreen() {
  const navigation = useNavigation<any>();
  const { data = [] } = useTrendingRestaurants();

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.header}>
        <LogoBadge size={64} />
        <View style={styles.headerText}>
          <Text style={styles.title}>Trending This Week</Text>
          <Text style={styles.copy}>
            Dining experiences people are saving right now.
          </Text>
        </View>
      </View>

      <View style={styles.categoriesSection}>
        <Text style={styles.sectionTitle}>🔥 Curated Collections</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScroll}
        >
          {TRENDING_CATEGORIES.map((category) => (
            <TouchableOpacity
              key={category.id}
              activeOpacity={0.8}
              style={styles.categoryCard}
              onPress={() =>
                navigation.navigate("TrendingCategory", {
                  categoryId: category.id,
                  categoryName: category.name,
                })
              }
            >
              <ImageBackground
                source={{ uri: category.image }}
                style={styles.categoryImage}
                imageStyle={styles.categoryImageStyle}
              >
                <LinearGradient
                  colors={["rgba(43, 29, 18, 0.1)", "rgba(43, 29, 18, 0.85)"]}
                  style={styles.gradient}
                >
                  <Text style={styles.categoryTitle}>{category.name}</Text>
                  <Text style={styles.categorySubtitle}>{category.subtitle}</Text>
                </LinearGradient>
              </ImageBackground>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <Text style={styles.sectionTitle}>✨ Popular Restaurants</Text>
    </View>
  );

  return (
    <Screen>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        numColumns={2}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.list}
        columnWrapperStyle={styles.columns}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <RestaurantCard
            restaurant={item}
            compact
            onPress={() =>
              navigation.navigate(
                "RestaurantDetails" as never,
                { restaurantId: item.id } as never,
              )
            }
          />
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    paddingBottom: 12,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
    padding: 20,
    paddingBottom: 16,
  },
  headerText: {
    flex: 1,
  },
  title: {
    ...typography.h1,
    color: colors.primaryDark,
  },
  copy: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: 4,
    lineHeight: 18,
  },
  categoriesSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    ...typography.title,
    color: colors.primaryDark,
    marginHorizontal: 20,
    marginBottom: 12,
  },
  categoriesScroll: {
    paddingHorizontal: 20,
    gap: 12,
  },
  categoryCard: {
    width: 160,
    height: 110,
    borderRadius: radius.md,
    overflow: "hidden",
    backgroundColor: colors.beige,
    ...shadows.card,
  },
  categoryImage: {
    width: "100%",
    height: "100%",
  },
  categoryImageStyle: {
    borderRadius: radius.md,
  },
  gradient: {
    width: "100%",
    height: "100%",
    justifyContent: "flex-end",
    padding: 12,
  },
  categoryTitle: {
    color: colors.white,
    fontFamily: "Georgia",
    fontSize: 16,
    fontWeight: "700",
  },
  categorySubtitle: {
    color: "#F1DEC8",
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
    marginTop: 2,
  },
  list: {
    paddingBottom: 110,
  },
  columns: {
    gap: 12,
    paddingHorizontal: 20,
    marginBottom: 14,
  },
});
