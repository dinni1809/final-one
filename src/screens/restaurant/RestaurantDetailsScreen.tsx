import { Feather } from '@expo/vector-icons';
import { DrawerActions, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { Image } from 'expo-image';
import * as Linking from 'expo-linking';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { CategoryTabs } from '@/components/restaurant/CategoryTabs';
import { FavoriteButton } from '@/components/restaurant/FavoriteButton';
import { MenuCard } from '@/components/restaurant/MenuCard';
import { RatingSummaryCard } from '@/components/restaurant/RatingSummaryCard';
import { VideoCard } from '@/components/restaurant/VideoCard';
import { IconButton } from '@/components/common/IconButton';
import { LogoBadge } from '@/components/common/LogoBadge';
import { Screen } from '@/components/common/Screen';
import { SearchBar } from '@/components/forms/SearchBar';
import { useMenu } from '@/hooks/useMenu';
import { useRatingSummary } from '@/hooks/useRating';
import { useRestaurantDetails } from '@/hooks/useRestaurants';
import { colors, radius, shadows, typography } from '@/theme';
import type { MenuCategory } from '@/types/restaurant';

type DetailsRoute = RouteProp<{ RestaurantDetails: { restaurantId: string } }, 'RestaurantDetails'>;

export function RestaurantDetailsScreen() {
  const navigation = useNavigation();
  const route = useRoute<DetailsRoute>();
  const restaurantId = route.params?.restaurantId ?? 'olive-bistro';
  const [category, setCategory] = useState<MenuCategory>('All');
  const { data: restaurant } = useRestaurantDetails(restaurantId);
  const { data: menu = [] } = useMenu(restaurantId, category);
  const { data: rating } = useRatingSummary(restaurantId);

  if (!restaurant || !rating) {
    return <Screen />;
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topNav}>
          <LogoBadge size={66} />
          <SearchBar onPress={() => navigation.navigate('Search' as never)} />
          <IconButton name="heart" size={25} onPress={() => navigation.navigate('Bookmarks' as never)} />
          <IconButton name="user" size={25} onPress={() => navigation.navigate('Profile' as never)} />
          <IconButton name="menu" size={27} onPress={() => navigation.dispatch(DrawerActions.openDrawer())} />
        </View>

        <View style={styles.banner}>
          <Image source={{ uri: restaurant.coverImage }} style={StyleSheet.absoluteFill} contentFit="cover" />
          <View style={styles.bannerShade} />
          <View style={styles.bannerButtons}>
            <IconButton name="chevron-left" filled onPress={() => navigation.goBack()} />
            <FavoriteButton id={restaurant.id} />
          </View>
          <View style={styles.bannerText}>
            <Text style={styles.restaurantName}>{restaurant.name}</Text>
            <View style={styles.metaRow}>
              <Text style={styles.bannerMeta}>{restaurant.cuisines.join(', ')}</Text>
              <Text style={styles.bannerMeta}>•</Text>
              <Feather name="map-pin" size={14} color={colors.white} />
              <Text style={styles.bannerMeta}>{restaurant.area}, {restaurant.city}</Text>
            </View>
            <View style={styles.pills}>
              <Text style={[styles.statusPill, restaurant.openNow ? styles.open : styles.closed]}>
                {restaurant.openNow ? 'Open Now' : 'Closed'}
              </Text>
              <Text style={styles.timePill}>{restaurant.timings}</Text>
            </View>
          </View>
        </View>

        <View style={styles.infoGrid}>
          <View style={styles.infoCol}>
            <RatingSummaryCard summary={rating} />
          </View>
          <View style={styles.infoColWide}>
            <VideoCard
              image={restaurant.coverImage}
              title={`Watch our experience at ${restaurant.name}`}
              onPress={() => Alert.alert('FAATTSOO Video', 'Video playback opens here.')}
            />
          </View>
        </View>

        <View style={styles.aboutCard}>
          <Text style={styles.aboutTitle}>About {restaurant.name}</Text>
          <Text style={styles.aboutCopy}>{restaurant.description}</Text>
          <TouchableOpacity style={styles.websiteButton} onPress={() => void Linking.openURL(restaurant.website)}>
            <Feather name="globe" size={19} color={colors.primaryDark} />
            <Text style={styles.websiteText}>Visit Website</Text>
            <Feather name="external-link" size={18} color={colors.primaryDark} />
          </TouchableOpacity>
        </View>

        <View style={styles.menuSection}>
          <View style={styles.menuHeader}>
            <Text style={styles.menuTitle}>Menu Highlights</Text>
            <View style={styles.menuLine} />
          </View>
          <CategoryTabs selected={category} onSelect={setCategory} />
          <View style={styles.menuGrid}>
            {menu.map((item) => <MenuCard key={item.id} item={item} />)}
          </View>
        </View>

        <View style={styles.notice}>
          <Feather name="bell" size={28} color={colors.primaryDark} />
          <View>
            <Text style={styles.noticeTitle}>Prices are exclusive of taxes.</Text>
            <Text style={styles.noticeCopy}>We levy 10% service charge.</Text>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 32,
    paddingHorizontal: 14,
    paddingTop: 10,
  },
  topNav: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    marginBottom: 18,
  },
  banner: {
    borderRadius: radius.lg,
    height: 250,
    overflow: 'hidden',
    ...shadows.card,
  },
  bannerShade: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.28)',
  },
  bannerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
  },
  bannerText: {
    bottom: 18,
    left: 18,
    position: 'absolute',
    right: 18,
  },
  restaurantName: {
    color: colors.white,
    fontFamily: 'Georgia',
    fontSize: 36,
    lineHeight: 42,
  },
  metaRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
    marginTop: 6,
  },
  bannerMeta: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '700',
  },
  pills: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  statusPill: {
    borderRadius: radius.pill,
    color: colors.white,
    fontSize: 12,
    fontWeight: '800',
    overflow: 'hidden',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  open: { backgroundColor: colors.success },
  closed: { backgroundColor: colors.danger },
  timePill: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: radius.pill,
    color: colors.white,
    fontSize: 12,
    fontWeight: '800',
    overflow: 'hidden',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  infoGrid: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 18,
  },
  infoCol: {
    flex: 0.9,
  },
  infoColWide: {
    flex: 1.25,
  },
  aboutCard: {
    backgroundColor: colors.beigeSoft,
    borderRadius: radius.md,
    gap: 14,
    marginTop: 14,
    padding: 18,
    ...shadows.soft,
  },
  aboutTitle: {
    color: colors.primaryDark,
    fontSize: 16,
    fontWeight: '800',
  },
  aboutCopy: {
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 23,
  },
  websiteButton: {
    alignItems: 'center',
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
    minHeight: 48,
    paddingHorizontal: 14,
  },
  websiteText: {
    color: colors.primaryDark,
    flex: 1,
    fontSize: 14,
    fontWeight: '800',
  },
  menuSection: {
    backgroundColor: 'rgba(255,255,255,0.42)',
    borderRadius: radius.lg,
    marginTop: 18,
    padding: 14,
    ...shadows.soft,
  },
  menuHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  menuTitle: {
    ...typography.h2,
    color: colors.primaryDark,
  },
  menuLine: {
    backgroundColor: colors.line,
    flex: 1,
    height: 1,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 14,
  },
  notice: {
    alignItems: 'center',
    backgroundColor: colors.beigeSoft,
    borderRadius: radius.md,
    flexDirection: 'row',
    gap: 16,
    marginTop: 18,
    padding: 16,
    ...shadows.soft,
  },
  noticeTitle: {
    color: colors.primaryDark,
    fontSize: 14,
    fontWeight: '800',
  },
  noticeCopy: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: 3,
  },
});
