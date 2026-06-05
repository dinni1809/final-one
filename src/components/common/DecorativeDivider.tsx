import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme';

type Props = {
  style?: any;
  lineWidth?: number;
};

export function DecorativeDivider({ style, lineWidth }: Props) {
  return (
    <View style={[styles.row, style]}>
      <View style={[styles.line, lineWidth !== undefined && { width: lineWidth }]} />
      <Text style={styles.star}>✦</Text>
      <View style={[styles.line, lineWidth !== undefined && { width: lineWidth }]} />
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

