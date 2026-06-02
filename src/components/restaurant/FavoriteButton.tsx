import { Feather } from '@expo/vector-icons';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { colors } from '@/theme';
import { useFavoriteStore } from '@/store/favoriteStore';

type Props = {
  id: string;
  type?: 'restaurant' | 'menu';
};

export function FavoriteButton({ id, type = 'restaurant' }: Props) {
  const isRestaurantFavorite = useFavoriteStore((state) => state.isRestaurantFavorite);
  const isMenuItemFavorite = useFavoriteStore((state) => state.isMenuItemFavorite);
  const toggleRestaurant = useFavoriteStore((state) => state.toggleRestaurant);
  const toggleMenuItem = useFavoriteStore((state) => state.toggleMenuItem);
  const active = type === 'restaurant' ? isRestaurantFavorite(id) : isMenuItemFavorite(id);

  return (
    <TouchableOpacity
      activeOpacity={0.74}
      style={styles.button}
      onPress={() => {
        if (type === 'restaurant') {
          void toggleRestaurant(id);
        } else {
          toggleMenuItem(id);
        }
      }}
    >
      <Feather name="heart" size={22} color={colors.primaryDark} />
      {active ? <Feather name="heart" size={22} color={colors.primaryDark} style={styles.active} /> : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 22,
    justifyContent: 'center',
    minHeight: 44,
    minWidth: 44,
  },
  active: {
    opacity: 0.2,
    position: 'absolute',
  },
});
