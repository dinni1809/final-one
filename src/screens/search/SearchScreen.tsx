import { useNavigation } from "@react-navigation/native";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { RestaurantCard } from "@/components/cards/RestaurantCard";
import { IconButton } from "@/components/common/IconButton";
import { LogoBadge } from "@/components/common/LogoBadge";
import { Screen } from "@/components/common/Screen";
import { SearchBar } from "@/components/forms/SearchBar";
import { useSearchRestaurants } from "@/hooks/useSearch";
import { useSearchStore } from "@/store/searchStore";
import { colors, spacing, typography } from "@/theme";

export function SearchScreen() {
  const navigation = useNavigation<any>();
  const query = useSearchStore((state) => state.query);
  const setQuery = useSearchStore((state) => state.setQuery);
  const recentSearches = useSearchStore((state) => state.recentSearches);
  const addRecentSearch = useSearchStore((state) => state.addRecentSearch);
  const { data = [] } = useSearchRestaurants(query);

  return (
    <Screen>
      <View style={styles.header}>
        <IconButton name="chevron-left" onPress={() => navigation.goBack()} />
        <LogoBadge size={48} />
        <SearchBar value={query} onChangeText={setQuery} />
      </View>
      {query.trim().length < 2 ? (
        <View style={styles.recent}>
          <Text style={styles.title}>Recent Searches</Text>
          {recentSearches.map((item) => (
            <TouchableOpacity
              key={item}
              style={styles.recentItem}
              onPress={() => setQuery(item)}
            >
              <Text style={styles.recentText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <RestaurantCard
              restaurant={item}
              onPress={() => {
                addRecentSearch(query);
                navigation.navigate(
                  "RestaurantDetails" as never,
                  { restaurantId: item.id } as never,
                );
              }}
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
    gap: 10,
    padding: 16,
  },
  recent: { gap: spacing.md, padding: 20 },
  title: { ...typography.h2, color: colors.primaryDark },
  recentItem: {
    backgroundColor: colors.beigeSoft,
    borderColor: colors.border,
    borderRadius: 14,
    borderWidth: 1,
    minHeight: 48,
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  recentText: { color: colors.primaryDark, fontWeight: "700" },
  list: { gap: 14, padding: 16, paddingBottom: 100 },
});
