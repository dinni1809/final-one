import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { colors, radius, shadows } from '@/theme';
import type { MenuItem } from '@/types/restaurant';
import { formatCurrency } from '@/utils/format';

import { FavoriteButton } from './FavoriteButton';

type Props = {
  item: MenuItem;
};

export function MenuCard({ item }: Props) {
  return (
    <View style={styles.card}>
      <View>
        <Image source={{ uri: item.image }} style={styles.image} contentFit="cover" />
        <View style={styles.favorite}>
          <FavoriteButton id={item.id} type="menu" />
        </View>
      </View>
      <View style={styles.body}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.description}>{item.description}</Text>
        <View style={styles.footer}>
          <Text style={styles.price}>{formatCurrency(item.price)}</Text>
          <TouchableOpacity style={styles.portion}>
            <Text style={styles.portionText}>{item.portions[0]}</Text>
            <Feather name="chevron-down" size={14} color={colors.primaryDark} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.beigeSoft,
    borderRadius: radius.md,
    marginBottom: 14,
    overflow: 'hidden',
    width: '48%',
    ...shadows.card,
  },
  image: {
    height: 112,
    width: '100%',
  },
  favorite: {
    position: 'absolute',
    right: 8,
    top: 8,
  },
  body: {
    gap: 5,
    padding: 10,
  },
  name: {
    color: colors.text,
    fontFamily: 'Georgia',
    fontSize: 17,
  },
  description: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 17,
    minHeight: 52,
  },
  footer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  price: {
    color: colors.primaryDark,
    fontSize: 17,
    fontWeight: '800',
  },
  portion: {
    alignItems: 'center',
    backgroundColor: colors.beige,
    borderRadius: 8,
    flexDirection: 'row',
    gap: 4,
    minHeight: 34,
    paddingHorizontal: 8,
  },
  portionText: {
    color: colors.primaryDark,
    fontSize: 12,
  },
});
