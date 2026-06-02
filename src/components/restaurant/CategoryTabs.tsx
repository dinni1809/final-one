import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';

import { colors, radius } from '@/theme';
import type { MenuCategory } from '@/types/restaurant';

const categories: MenuCategory[] = ['All', 'Starters', 'Mains', 'Desserts', 'Beverages'];

type Props = {
  selected: MenuCategory;
  onSelect: (category: MenuCategory) => void;
};

export function CategoryTabs({ selected, onSelect }: Props) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {categories.map((category) => {
        const active = selected === category;
        return (
          <TouchableOpacity key={category} activeOpacity={0.75} onPress={() => onSelect(category)} style={[styles.tab, active && styles.active]}>
            <Text style={[styles.text, active && styles.activeText]}>{category}</Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: 8,
    paddingVertical: 2,
  },
  tab: {
    backgroundColor: colors.beige,
    borderColor: colors.border,
    borderRadius: radius.pill,
    borderWidth: 1,
    minHeight: 36,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  active: {
    backgroundColor: colors.primaryDark,
    borderColor: colors.primaryDark,
  },
  text: {
    color: colors.primaryDark,
    fontSize: 12,
    fontWeight: '700',
  },
  activeText: {
    color: colors.white,
  },
});
