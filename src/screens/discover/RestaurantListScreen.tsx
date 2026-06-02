import { useNavigation } from '@react-navigation/native';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { RestaurantCard } from '@/components/cards/RestaurantCard';
import { IconButton } from '@/components/common/IconButton';
import { Screen } from '@/components/common/Screen';
import { useRestaurants } from '@/hooks/useRestaurants';
import { useFilterStore } from '@/store/filterStore';
import { colors, typography } from '@/theme';

export function RestaurantListScreen() {
  const navigation = useNavigation();
  const filters = useFilterStore((state) => state.filters);
  const { data = [] } = useRestaurants(filters);

  return (
    <Screen>
      <View style={styles.header}>
        <IconButton name="chevron-left" onPress={() => navigation.goBack()} />
        <Text style={styles.title}>Top Tables</Text>
        <View style={styles.spacer} />
      </View>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.list}
        columnWrapperStyle={styles.columns}
        renderItem={({ item }) => (
          <RestaurantCard restaurant={item} compact onPress={() => navigation.navigate('RestaurantDetails' as never, { restaurantId: item.id } as never)} />
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  title: { ...typography.h2, color: colors.primaryDark },
  spacer: { width: 44 },
  list: { padding: 16, paddingBottom: 110 },
  columns: { gap: 12, marginBottom: 14 },
});
