import { DrawerActions, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { PrimaryButton } from '@/components/buttons/PrimaryButton';
import { OfferCard } from '@/components/cards/OfferCard';
import { RestaurantCard } from '@/components/cards/RestaurantCard';
import { DecorativeDivider } from '@/components/common/DecorativeDivider';
import { IconButton } from '@/components/common/IconButton';
import { LogoBadge } from '@/components/common/LogoBadge';
import { Screen } from '@/components/common/Screen';
import { SectionHeader } from '@/components/common/SectionHeader';
import { useTopOffers, useTrendingRestaurants } from '@/hooks/useHomeData';
import { colors, radius, shadows, spacing, typography } from '@/theme';
import type { HomeStackParamList } from '@/types/navigation';

type Nav = NativeStackNavigationProp<HomeStackParamList>;

export function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const rootNavigation = useNavigation<any>();
  const { data: offers = [] } = useTopOffers();
  const { data: trending = [] } = useTrendingRestaurants();

  const openRestaurant = (restaurantId: string) => navigation.navigate('RestaurantDetails', { restaurantId });

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <IconButton name="menu" size={29} onPress={() => rootNavigation.dispatch(DrawerActions.openDrawer())} />
          <LogoBadge size={92} />
          <IconButton name="bell" size={27} onPress={() => rootNavigation.navigate('Notifications' as never)} />
        </View>

        <View style={styles.heroText}>
          <Text style={styles.headline}>Curated Dining, Made Effortless</Text>
          <DecorativeDivider lineWidth={32} style={{ marginVertical: 8 }} />
        </View>

        <LinearGradient colors={['#9B5D20', '#3A1604']} style={styles.ctaCard}>
          <View style={styles.compass}>
            <Text style={styles.compassText}>◆</Text>
          </View>
          <Text style={styles.ctaTitle}>Discover Restaurants</Text>
          <Text style={styles.ctaCopy}>Explore curated dining experiences across Bangalore.</Text>
          <PrimaryButton
            title="Start Exploring"
            light
            icon="arrow-right"
            style={{ alignSelf: 'stretch', height: 52, minHeight: 52 }}
            onPress={() => rootNavigation.navigate('Tabs' as never, { screen: 'Discover' } as never)}
          />
        </LinearGradient>

        <View style={styles.sectionCard}>
          <SectionHeader title="Top Offers This Week" icon="tag" onViewAll={() => navigation.navigate('Offers')} />
          <FlatList
            data={offers}
            horizontal
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => <OfferCard offer={item} onPress={() => openRestaurant(item.restaurantId)} />}
          />
        </View>

        <View style={styles.sectionCard}>
          <SectionHeader title="Trending This Week" icon="trending-up" onViewAll={() => rootNavigation.navigate('Trending' as never)} />
          <FlatList
            data={trending.slice(0, 5)}
            horizontal
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => <RestaurantCard restaurant={item} compact onPress={() => openRestaurant(item.id)} />}
          />
          <View style={styles.dots}>
            {[0, 1, 2, 3, 4].map((dot) => <View key={dot} style={[styles.dot, dot === 0 && styles.dotActive]} />)}
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 112,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  heroText: {
    alignItems: 'center',
    marginTop: 12,
  },
  headline: {
    ...typography.h1,
    fontSize: 24,
    color: colors.primaryDark,
    marginBottom: 8,
    textAlign: 'center',
  },
  ctaCard: {
    alignItems: 'center',
    borderColor: '#E7C29D',
    borderRadius: radius.xl,
    borderWidth: 2,
    gap: 10,
    marginHorizontal: 24,
    marginTop: 12,
    overflow: 'hidden',
    padding: 20,
    height: 240,
    ...shadows.button,
  },
  compass: {
    alignItems: 'center',
    backgroundColor: colors.beigeSoft,
    borderRadius: 24,
    height: 48,
    justifyContent: 'center',
    transform: [{ rotate: '-14deg' }],
    width: 48,
  },
  compassText: {
    color: colors.primaryDark,
    fontSize: 20,
  },
  ctaTitle: {
    color: colors.white,
    fontFamily: 'Georgia',
    fontSize: 24,
  },
  ctaCopy: {
    color: colors.white,
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.92,
    textAlign: 'center',
  },
  sectionCard: {
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: radius.lg,
    marginTop: 20,
    padding: 14,
    ...shadows.soft,
  },
  dots: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
    marginTop: 12,
  },
  dot: {
    backgroundColor: colors.border,
    borderRadius: 4,
    height: 8,
    width: 8,
  },
  dotActive: {
    backgroundColor: colors.primaryDark,
  },
});
