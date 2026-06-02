import { StyleSheet, View } from 'react-native';

import { colors, radius } from '@/theme';

export function LoadingSkeleton() {
  return <View style={styles.skeleton} />;
}

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: colors.border,
    borderRadius: radius.md,
    height: 120,
    opacity: 0.6,
    width: '100%',
  },
});
