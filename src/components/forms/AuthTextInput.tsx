import { Feather } from '@expo/vector-icons';
import { Platform, StyleSheet, TextInput, TextInputProps, View } from 'react-native';

import { colors } from '@/theme';

type Props = TextInputProps & {
  icon: keyof typeof Feather.glyphMap;
  rightIcon?: keyof typeof Feather.glyphMap;
  onRightPress?: () => void;
};

export function AuthTextInput({ icon, rightIcon, onRightPress, ...props }: Props) {
  return (
    <View style={styles.inputWrap}>
      <Feather name={icon} size={26} color={colors.primaryDark} />
      <TextInput
        placeholderTextColor={colors.textSecondary}
        style={[styles.input, webInputReset]}
        autoCapitalize="none"
        {...props}
      />
      {rightIcon ? <Feather name={rightIcon} size={24} color={colors.primaryDark} onPress={onRightPress} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  inputWrap: {
    alignItems: 'center',
    borderBottomColor: colors.line,
    borderBottomWidth: 1.5,
    flexDirection: 'row',
    gap: 14,
    minHeight: 56,
    paddingHorizontal: 4,
  },
  input: {
    color: colors.text,
    flex: 1,
    fontSize: 17,
  },
});

const webInputReset = Platform.OS === 'web' ? ({ outlineStyle: 'none' } as never) : undefined;
