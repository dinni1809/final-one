import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { colors, typography } from '@/theme';

type Props = {
  title: string;
  icon?: keyof typeof Feather.glyphMap;
  onViewAll?: () => void;
};

export function SectionHeader({ title, icon, onViewAll }: Props) {
  return (
    <View style={styles.row}>
      <View style={styles.titleRow}>
        {icon ? <Feather name={icon} size={18} color={colors.primaryDark} /> : null}
        <Text style={styles.title}>{title}</Text>
      </View>
      {onViewAll ? (
        <TouchableOpacity style={styles.viewAll} onPress={onViewAll} activeOpacity={0.72}>
          <Text style={styles.viewText}>View all</Text>
          <Feather name="chevron-right" size={20} color={colors.primaryDark} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  titleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  title: {
    ...typography.title,
    fontSize: 22,
  },
  viewAll: {
    alignItems: 'center',
    flexDirection: 'row',
    minHeight: 44,
  },
  viewText: {
    color: colors.primaryDark,
    fontSize: 14,
    fontWeight: '700',
  },
});
