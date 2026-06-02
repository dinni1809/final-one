import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';

import { colors, radius, shadows } from '@/theme';

type Props = {
  title: string;
  onPress: () => void;
  loading?: boolean;
  icon?: keyof typeof Feather.glyphMap;
  style?: ViewStyle;
  light?: boolean;
};

export function PrimaryButton({ title, onPress, loading, icon, style, light }: Props) {
  if (light) {
    return (
      <TouchableOpacity activeOpacity={0.78} onPress={onPress} style={[styles.lightButton, style]}>
        <Text style={styles.lightText}>{title}</Text>
        {icon ? <Feather name={icon} size={22} color={colors.primaryDark} /> : null}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress} disabled={loading} style={[styles.button, style]}>
      <LinearGradient colors={[colors.primary, '#6B3304']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.gradient}>
        {loading ? <ActivityIndicator color={colors.white} /> : <Text style={styles.text}>{title}</Text>}
        {!loading && icon ? <Feather name={icon} size={22} color={colors.white} /> : null}
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 56,
    borderRadius: radius.lg,
    overflow: 'hidden',
    ...shadows.button,
  },
  gradient: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
    minHeight: 56,
    paddingHorizontal: 24,
  },
  text: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '800',
  },
  lightButton: {
    alignItems: 'center',
    backgroundColor: colors.beigeSoft,
    borderRadius: radius.pill,
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
    minHeight: 52,
    paddingHorizontal: 28,
  },
  lightText: {
    color: colors.primaryDark,
    fontSize: 17,
    fontWeight: '800',
  },
});
