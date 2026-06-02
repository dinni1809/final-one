import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { colors, radius, shadows } from '@/theme';
import type { Restaurant } from '@/types/restaurant';
import { formatPriceLevel } from '@/utils/format';

import { FavoriteButton } from '../restaurant/FavoriteButton';

type Props = {
  restaurant: Restaurant;
  onPress: () => void;
  compact?: boolean;
};

export function RestaurantCard({ restaurant, onPress, compact }: Props) {
  return (
    <TouchableOpacity activeOpacity={0.78} onPress={onPress} style={[styles.card, compact && styles.compact]}>
      <View>
        <Image source={{ uri: restaurant.image }} style={[styles.image, compact && styles.compactImage]} contentFit="cover" />
        <View style={[styles.ratingBadge, !compact && styles.ratingBottom]}>
          <Feather name="star" size={13} color={colors.primaryDark} />
          <Text style={styles.rating}>{restaurant.rating.toFixed(1)}</Text>
        </View>
        {!compact ? <View style={styles.favorite}><FavoriteButton id={restaurant.id} /></View> : null}
      </View>
      <View style={styles.body}>
        <Text style={styles.name} numberOfLines={1}>{restaurant.name}</Text>
        <Text style={styles.cuisine} numberOfLines={1}>{restaurant.cuisines.join(', ')}</Text>
        <View style={styles.location}>
          <Feather name="map-pin" size={12} color={colors.textSecondary} />
          <Text style={styles.locationText} numberOfLines={1}>{restaurant.area}, {restaurant.city}</Text>
        </View>
        <View style={styles.bottom}>
          <Text style={styles.pill}>{restaurant.cuisines[0]}</Text>
          <Text style={styles.price}>{formatPriceLevel(restaurant.priceLevel)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.beigeSoft,
    borderRadius: radius.md,
    marginRight: 12,
    overflow: 'hidden',
    width: 210,
    ...shadows.card,
  },
  compact: {
    width: 148,
  },
  image: {
    height: 150,
    width: '100%',
  },
  compactImage: {
    height: 110,
  },
  ratingBadge: {
    alignItems: 'center',
    backgroundColor: colors.beigeSoft,
    borderRadius: radius.pill,
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 5,
    position: 'absolute',
    right: 8,
    top: 8,
  },
  ratingBottom: {
    bottom: 8,
    left: 8,
    right: undefined,
    top: undefined,
  },
  rating: {
    color: colors.primaryDark,
    fontSize: 13,
    fontWeight: '800',
  },
  favorite: {
    position: 'absolute',
    right: 8,
    top: 8,
  },
  body: {
    gap: 6,
    padding: 10,
  },
  name: {
    color: colors.text,
    fontFamily: 'Georgia',
    fontSize: 18,
  },
  cuisine: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  location: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  locationText: {
    color: colors.textSecondary,
    flex: 1,
    fontSize: 12,
  },
  bottom: {
    alignItems: 'center',
    borderTopColor: colors.border,
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
  },
  pill: {
    backgroundColor: '#F1DEC8',
    borderRadius: 5,
    color: colors.primaryDark,
    fontSize: 12,
    paddingHorizontal: 7,
    paddingVertical: 5,
  },
  price: {
    color: colors.primaryDark,
    fontSize: 15,
    fontWeight: '800',
  },
});
