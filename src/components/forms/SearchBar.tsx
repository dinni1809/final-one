import { Feather } from '@expo/vector-icons';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

import { colors, radius, shadows } from '@/theme';

type Props = {
  value?: string;
  onChangeText?: (text: string) => void;
  onPress?: () => void;
};

export function SearchBar({ value, onChangeText, onPress }: Props) {
  return (
    <TouchableOpacity activeOpacity={onPress ? 0.75 : 1} onPress={onPress} style={styles.wrap}>
      <View style={styles.inner}>
        <Feather name="search" size={20} color={colors.primaryDark} />
        <TextInput
          editable={!onPress}
          pointerEvents={onPress ? 'none' : 'auto'}
          placeholder="Search for restaurants, cuisines..."
          placeholderTextColor={colors.textSecondary}
          value={value}
          onChangeText={onChangeText}
          style={styles.input}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
  },
  inner: {
    alignItems: 'center',
    backgroundColor: colors.beigeSoft,
    borderRadius: radius.pill,
    flexDirection: 'row',
    gap: 12,
    minHeight: 50,
    paddingHorizontal: 18,
    ...shadows.soft,
  },
  input: {
    color: colors.text,
    flex: 1,
    fontSize: 14,
  },
});
