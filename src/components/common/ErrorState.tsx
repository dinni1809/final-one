import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme';

type Props = {
  message: string;
};

export function ErrorState({ message }: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center', padding: 24 },
  text: { color: colors.danger, fontSize: 15, textAlign: 'center' },
});
