import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme';

type Props = {
  title: string;
};

export function EmptyState({ title }: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.text}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center', padding: 24 },
  text: { color: colors.textSecondary, fontSize: 15, textAlign: 'center' },
});
