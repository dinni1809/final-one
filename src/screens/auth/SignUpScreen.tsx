import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '@/components/buttons/PrimaryButton';
import { LogoBadge } from '@/components/common/LogoBadge';
import { Screen } from '@/components/common/Screen';
import { AuthTextInput } from '@/components/forms/AuthTextInput';
import { useAuthStore } from '@/store/authStore';
import { colors, spacing, typography } from '@/theme';
import type { AuthStackParamList } from '@/types/navigation';

type Props = NativeStackScreenProps<AuthStackParamList, 'SignUp'>;

export function SignUpScreen({ navigation }: Props) {
  const login = useAuthStore((state) => state.login);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const createAccount = async () => {
    if (name.trim().length < 2 || !email.includes('@') || password.length < 4) {
      Alert.alert('Complete details', 'Add your name, email, and a password with at least 4 characters.');
      return;
    }

    setLoading(true);
    try {
      await login(email.trim(), password);
    } catch (error) {
      Alert.alert('Sign up failed', error instanceof Error ? error.message : 'Please try again');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <View style={styles.content}>
        <LogoBadge size={104} />
        <Text style={styles.title}>Create Account</Text>
        <AuthTextInput icon="user" placeholder="Full name" value={name} onChangeText={setName} />
        <AuthTextInput icon="mail" placeholder="Email address" keyboardType="email-address" value={email} onChangeText={setEmail} />
        <AuthTextInput icon="lock" placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
        <PrimaryButton title="Sign Up" onPress={createAccount} loading={loading} />
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
});
