import { useNavigation } from "@react-navigation/native";
import { FlatList, StyleSheet, Text, View } from "react-native";

import { RestaurantCard } from "@/components/cards/RestaurantCard";
import { LogoBadge } from "@/components/common/LogoBadge";
import { Screen } from "@/components/common/Screen";
import { useTrendingRestaurants } from "@/hooks/useHomeData";
import { colors, typography } from "@/theme";

export function TrendingScreen() {
  const navigation = useNavigation<any>();
  const { data = [] } = useTrendingRestaurants();

  return (
    <Screen>
      <View style={styles.header}>
        <LogoBadge size={64} />
        <View style={styles.headerText}>
          <Text style={styles.title}>Trending This Week</Text>
          <Text style={styles.copy}>
            Dining experiences people are saving right now.
          </Text>
        </View>
      </View>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.list}
        columnWrapperStyle={styles.columns}
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
  header: { alignItems: "center", flexDirection: "row", gap: 12, padding: 20, paddingBottom: 8 },
  headerText: { flex: 1 },
  title: { ...typography.h1, color: colors.primaryDark },
  copy: { color: colors.textSecondary, fontSize: 15, marginTop: 6 },
  list: { padding: 16, paddingBottom: 110 },
  columns: { gap: 12, marginBottom: 14 },
});
