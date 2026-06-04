import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { colors, radius, shadows } from '@/theme';
import type { Restaurant } from '@/types/restaurant';
import { normalizeCuisineValues } from '@/utils/filterOptions';
import { formatPriceLevel } from '@/utils/format';
import {
  RESTAURANT_IMAGE_FALLBACK,
  recordImageLoadFailure,
} from '@/utils/restaurantImageAudit';

import { FavoriteButton } from '../restaurant/FavoriteButton';

type Props = {
  restaurant: Restaurant;
  onPress: () => void;
  compact?: boolean;
};

export function RestaurantCard({ restaurant, onPress, compact }: Props) {
  const cuisines = useMemo(
    () => normalizeCuisineValues(restaurant.cuisines),
    [restaurant.cuisines],
  );
  const cuisineLabel = cuisines.length > 0 ? cuisines.join(', ') : 'Cuisine unavailable';
  const primaryCuisine = cuisines[0] ?? '—';
  const locationLabel = [restaurant.area, restaurant.city].filter(Boolean).join(', ');
  const priceLabel = formatPriceLevel(restaurant.priceLevel);

  const [imageUri, setImageUri] = useState(restaurant.image);
  const [usedFallback, setUsedFallback] = useState(false);

  useEffect(() => {
    setImageUri(restaurant.image);
    setUsedFallback(false);
  }, [restaurant.id, restaurant.image]);

  const handleImageError = () => {
    const reason = usedFallback
      ? 'Fallback image also failed to load'
      : 'Remote image request failed (network, 404, or invalid URL)';

    recordImageLoadFailure({
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
      url: imageUri,
      reason,
    });

    if (!usedFallback) {
      setUsedFallback(true);
      setImageUri(RESTAURANT_IMAGE_FALLBACK);
    }
  };

  return (
    <TouchableOpacity activeOpacity={0.78} onPress={onPress} style={[styles.card, compact && styles.compact]}>
      <View>
        <Image
          source={{ uri: imageUri }}
          style={[styles.image, compact && styles.compactImage]}
          contentFit="cover"
          onError={handleImageError}
        />
        <View style={[styles.ratingBadge, !compact && styles.ratingBottom]}>
          <Feather name="star" size={13} color={colors.primaryDark} />
          <Text style={styles.rating}>{restaurant.rating.toFixed(1)}</Text>
        </View>
        {!compact ? <View style={styles.favorite}><FavoriteButton id={restaurant.id} /></View> : null}
      </View>
      <View style={styles.body}>
        <Text style={styles.name} numberOfLines={1}>{restaurant.name}</Text>
        <Text style={styles.cuisine} numberOfLines={1}>{cuisineLabel}</Text>
        <View style={styles.location}>
          <Feather name="map-pin" size={12} color={colors.textSecondary} />
          <Text style={styles.locationText} numberOfLines={1}>{locationLabel}</Text>
        </View>
        <View style={styles.bottom}>
          <Text style={styles.pill} numberOfLines={1}>{primaryCuisine}</Text>
          <Text style={styles.price}>{priceLabel}</Text>
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
    flex: 1,
    fontSize: 12,
    marginRight: 8,
    maxWidth: '58%',
    paddingHorizontal: 7,
    paddingVertical: 5,
  },
  price: {
    color: colors.primaryDark,
    fontSize: 15,
    fontWeight: '800',
  },
});
