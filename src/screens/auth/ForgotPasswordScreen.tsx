import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '@/components/buttons/PrimaryButton';
import { LogoBadge } from '@/components/common/LogoBadge';
import { Screen } from '@/components/common/Screen';
import { AuthTextInput } from '@/components/forms/AuthTextInput';
import { authService } from '@/services/authService';
import { colors, spacing, typography } from '@/theme';
import type { AuthStackParamList } from '@/types/navigation';

type Props = NativeStackScreenProps<AuthStackParamList, 'ForgotPassword'>;

export function ForgotPasswordScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const sendRecovery = async () => {
    if (!email.includes('@')) {
      Alert.alert('Enter email', 'Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      await authService.forgotPassword(email.trim());
      Alert.alert('Recovery link sent', 'Check your inbox for reset instructions.');
    } catch {
      Alert.alert('Recovery link sent', 'Check your inbox for reset instructions.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <View style={styles.content}>
        <LogoBadge size={104} />
        <Text style={styles.title}>Password Recovery</Text>
        <Text style={styles.copy}>Enter your email and we’ll send recovery instructions.</Text>
        <AuthTextInput icon="mail" placeholder="Email address" keyboardType="email-address" value={email} onChangeText={setEmail} />
        <PrimaryButton title="Send Recovery Link" onPress={sendRecovery} loading={loading} />
        <PrimaryButton title="Back to Login" light onPress={() => navigation.goBack()} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
    flex: 1,
    gap: spacing.lg,
    justifyContent: 'center',
    padding: 28,
  },
  title: { ...typography.h1, color: colors.primaryDark, textAlign: 'center' },
  copy: { color: colors.textSecondary, fontSize: 16, lineHeight: 23, textAlign: 'center' },
});
