import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Alert, StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '@/components/buttons/PrimaryButton';
import { Screen } from '@/components/common/Screen';
import { AuthTextInput } from '@/components/forms/AuthTextInput';
import { colors, spacing, typography } from '@/theme';
import type { AuthStackParamList } from '@/types/navigation';

type Props = NativeStackScreenProps<AuthStackParamList, 'ForgotPassword'>;

export function ForgotPasswordScreen({ navigation }: Props) {
  return (
    <Screen>
      <View style={styles.content}>
        <Text style={styles.title}>Password Recovery</Text>
        <Text style={styles.copy}>Enter your email and we’ll send recovery instructions.</Text>
        <AuthTextInput icon="mail" placeholder="Email address" keyboardType="email-address" />
        <PrimaryButton title="Send Recovery Link" onPress={() => Alert.alert('Recovery link sent')} />
        <PrimaryButton title="Back to Login" light onPress={() => navigation.goBack()} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    gap: spacing.lg,
    justifyContent: 'center',
    padding: 28,
  },
  title: { ...typography.h1, color: colors.primaryDark },
  copy: { color: colors.textSecondary, fontSize: 16, lineHeight: 23 },
});
