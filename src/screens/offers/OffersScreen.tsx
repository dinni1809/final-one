import { useNavigation } from '@react-navigation/native';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { OfferCard } from '@/components/cards/OfferCard';
import { IconButton } from '@/components/common/IconButton';
import { Screen } from '@/components/common/Screen';
import { useTopOffers } from '@/hooks/useHomeData';
import { colors, typography } from '@/theme';

export function OffersScreen() {
  const navigation = useNavigation();
  const { data = [] } = useTopOffers();

  return (
    <Screen>
      <View style={styles.header}>
        <IconButton name="chevron-left" onPress={() => navigation.goBack()} />
        <Text style={styles.title}>Top Offers</Text>
        <View style={styles.spacer} />
      </View>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.list}
        columnWrapperStyle={styles.columns}
        renderItem={({ item }) => <OfferCard offer={item} onPress={() => navigation.navigate('RestaurantDetails' as never, { restaurantId: item.restaurantId } as never)} />}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', padding: 16 },
  title: { ...typography.h2, color: colors.primaryDark },
  spacer: { width: 44 },
  list: { padding: 16, paddingBottom: 110 },
  columns: { gap: 12, marginBottom: 14 },
});
