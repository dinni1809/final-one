import { DrawerActions, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';

import { FilterCard } from '@/components/cards/FilterCard';
import { RestaurantCard } from '@/components/cards/RestaurantCard';
import { DecorativeDivider } from '@/components/common/DecorativeDivider';
import { IconButton } from '@/components/common/IconButton';
import { LogoBadge } from '@/components/common/LogoBadge';
import { Screen } from '@/components/common/Screen';
import { SectionHeader } from '@/components/common/SectionHeader';
import { useRestaurants } from '@/hooks/useRestaurants';
import { useFilterStore } from '@/store/filterStore';
import { colors, radius, shadows, typography } from '@/theme';
import type { DiscoverStackParamList } from '@/types/navigation';

type Nav = NativeStackNavigationProp<DiscoverStackParamList>;

export function DiscoverScreen() {
  const navigation = useNavigation<Nav>();
  const rootNavigation = useNavigation();
  const filters = useFilterStore((state) => state.filters);
  const setFilter = useFilterStore((state) => state.setFilter);
  const { data: restaurants = [] } = useRestaurants(filters);

  const cycle = (key: keyof typeof filters, values: string[]) => {
    const current = filters[key];
    const index = current ? values.indexOf(current) : -1;
    setFilter(key, values[(index + 1) % values.length] as never);
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <LogoBadge size={82} />
          <View style={styles.headerIcons}>
            <IconButton name="heart" size={27} onPress={() => rootNavigation.navigate('Bookmarks' as never)} />
            <IconButton name="user" size={27} onPress={() => rootNavigation.navigate('Profile' as never)} />
            <IconButton name="menu" size={29} onPress={() => rootNavigation.dispatch(DrawerActions.openDrawer())} />
          </View>
        </View>

        <View style={styles.heroSketch} />
        <Text style={styles.title}>Discover Restaurants</Text>
        <DecorativeDivider />
        <Text style={styles.subtitle}>Curated places. Great experiences.</Text>

        <FlatList
          data={[
            { label: 'AREA', value: filters.area ?? 'Select Area', icon: 'map-pin' as const, onPress: () => cycle('area', ['Koramangala', 'Indiranagar', 'JP Nagar', 'Jayanagar']) },
            { label: 'PRICE', value: filters.price ?? 'Select Price', icon: 'currency-inr' as const, onPress: () => cycle('price', ['Budget', 'Mid', 'Premium', 'Luxury']) },
            { label: 'MENU ITEM', value: filters.menuItem ?? 'Select Item', icon: 'silverware-cloche' as const, onPress: () => cycle('menuItem', ['Biryani', 'Pizza', 'Burger', 'Pasta']) },
            { label: 'CUISINE', value: filters.cuisine ?? 'Select Cuisine', icon: 'bowl-steam' as const, onPress: () => cycle('cuisine', ['Italian', 'Continental', 'Cafe', 'North Indian', 'South Indian']) },
            { label: 'RESTAURANT TYPE', value: filters.style ?? 'Select Type', icon: 'storefront-outline' as const, onPress: () => cycle('style', ['Cafe', 'Fine Dining', 'Restaurant']) },
          ]}
          horizontal
          keyExtractor={(item) => item.label}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filters}
          renderItem={({ item }) => <FilterCard label={item.label} value={item.value} icon={item.icon} onPress={item.onPress} />}
        />

        <View style={styles.tables}>
          <SectionHeader title="Top Tables This Week" onViewAll={() => navigation.navigate('RestaurantList')} />
          <Text style={styles.sectionCopy}>Handpicked restaurants for memorable dining experiences.</Text>
          <FlatList
            data={restaurants.slice(0, 5)}
            horizontal
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => <RestaurantCard restaurant={item} onPress={() => navigation.navigate('RestaurantDetails', { restaurantId: item.id })} />}
          />
        </View>
      </ScrollView>
      <LinearGradient colors={['rgba(255,255,255,0)', '#8B4E12']} style={styles.bottomWave} />
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
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 8,
  },
  heroSketch: {
    borderColor: '#D6A36E',
    borderWidth: 1,
    height: 150,
    opacity: 0.22,
    position: 'absolute',
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
    fontFamily: 'Georgia',
    fontSize: 22,
    marginTop: 22,
  },
  filters: {
    paddingTop: 58,
  },
  tables: {
    backgroundColor: 'rgba(255,255,255,0.44)',
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
  bottomWave: {
    bottom: -50,
    height: 118,
    position: 'absolute',
    right: -36,
    transform: [{ rotate: '-5deg' }],
    width: 360,
  },
});
