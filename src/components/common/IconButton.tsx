import { Feather } from '@expo/vector-icons';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { colors } from '@/theme';

type Props = {
  name: keyof typeof Feather.glyphMap;
  onPress?: () => void;
  filled?: boolean;
  size?: number;
};

export function IconButton({ name, onPress, filled, size = 24 }: Props) {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      activeOpacity={0.72}
      onPress={onPress}
      style={[styles.button, filled && styles.filled]}
    >
      <Feather name={name} size={size} color={colors.primaryDark} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
    minWidth: 44,
  },
  filled: {
    backgroundColor: colors.white,
    borderRadius: 22,
  },
});
