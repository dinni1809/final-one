import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme';

export function DecorativeDivider() {
  return (
    <View style={styles.row}>
      <View style={styles.line} />
      <Text style={styles.star}>✦</Text>
      <View style={styles.line} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  line: {
    width: 64,
    height: 1,
    backgroundColor: colors.line,
  },
  star: {
    color: colors.primary,
    fontSize: 18,
  },
});
