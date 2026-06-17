import { Feather } from '@expo/vector-icons';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

import { colors, shadows } from '@/theme';

type Props = {
  value?: string;
  onChangeText?: (text: string) => void;
  onPress?: () => void;
};

export function SearchBar({ value, onChangeText, onPress }: Props) {
  return (
    <TouchableOpacity activeOpacity={onPress ? 0.75 : 1} onPress={onPress} style={styles.wrap}>
      <View style={styles.inner}>
        <Feather name="search" size={20} color={colors.primaryDark} style={styles.searchIcon} />
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
    width: '100%',
  },
  inner: {
    alignItems: 'center',
    backgroundColor: colors.beigeSoft,
    borderRadius: 22,
    flexDirection: 'row',
    minHeight: 46,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#EADDC9',
    ...shadows.soft,
  },
  searchIcon: {
    marginRight: 10,
    alignSelf: 'center',
  },
  input: {
    color: colors.text,
    flex: 1,
    fontSize: 14,
    paddingVertical: 8,
    textAlignVertical: 'center',
  },
});
