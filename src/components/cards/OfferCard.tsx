import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { colors, radius, shadows } from '@/theme';
import type { Offer } from '@/types/restaurant';

type Props = {
  offer: Offer;
  onPress: () => void;
};

export function OfferCard({ offer, onPress }: Props) {
  return (
    <TouchableOpacity activeOpacity={0.78} onPress={onPress} style={styles.card}>
      <View>
        <Image source={{ uri: offer.image }} style={styles.image} contentFit="cover" />
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{offer.badge}</Text>
        </View>
      </View>
      <View style={styles.body}>
        <Text style={styles.name} numberOfLines={1}>
          {offer.restaurantName}
        </Text>
        <View style={styles.meta}>
          <Feather name="map-pin" size={11} color={colors.primaryDark} />
          <Text style={styles.metaText} numberOfLines={1}>
            {offer.location}
          </Text>
        </View>
        <View style={styles.offerPill}>
          <Feather name="tag" size={11} color={colors.primaryDark} />
          <Text style={styles.offerText} numberOfLines={1}>
            {offer.title}
          </Text>
        </View>
      </View>
      <View style={styles.footer}>
        <Text style={styles.valid}>Valid till {offer.validUntil}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.beigeSoft,
    borderRadius: radius.md,
    marginRight: 10,
    overflow: 'hidden',
    width: 116,
    ...shadows.card,
  },
  image: {
    height: 92,
    width: '100%',
  },
  badge: {
    backgroundColor: colors.primary,
    borderBottomLeftRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 5,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  badgeText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '800',
    textAlign: 'center',
  },
  body: {
    padding: 8,
    gap: 5,
  },
  name: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '700',
  },
  meta: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 3,
  },
  metaText: {
    color: colors.text,
    flex: 1,
    fontSize: 10,
  },
  offerPill: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#F3DFCA',
    borderRadius: 5,
    flexDirection: 'row',
    gap: 4,
    maxWidth: '100%',
    paddingHorizontal: 5,
    paddingVertical: 4,
  },
  offerText: {
    color: colors.primaryDark,
    flexShrink: 1,
    fontSize: 9,
  },
  footer: {
    backgroundColor: '#EED6BA',
    padding: 8,
  },
  valid: {
    color: colors.primaryDark,
    fontSize: 10,
  },
});
