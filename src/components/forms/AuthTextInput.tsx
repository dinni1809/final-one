import { Feather } from '@expo/vector-icons';
import { StyleSheet, TextInput, TextInputProps, View } from 'react-native';

import { colors, radius } from '@/theme';

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
        style={styles.input}
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
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    flexDirection: 'row',
    gap: 14,
    minHeight: 62,
    paddingHorizontal: 18,
  },
  input: {
    color: colors.text,
    flex: 1,
    fontSize: 17,
  },
});
