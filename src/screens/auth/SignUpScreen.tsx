import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Alert, StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '@/components/buttons/PrimaryButton';
import { Screen } from '@/components/common/Screen';
import { AuthTextInput } from '@/components/forms/AuthTextInput';
import { colors, spacing, typography } from '@/theme';
import type { AuthStackParamList } from '@/types/navigation';

type Props = NativeStackScreenProps<AuthStackParamList, 'SignUp'>;

export function SignUpScreen({ navigation }: Props) {
  return (
    <Screen>
      <View style={styles.content}>
        <Text style={styles.title}>Create Account</Text>
        <AuthTextInput icon="user" placeholder="Full name" />
        <AuthTextInput icon="mail" placeholder="Email address" keyboardType="email-address" />
        <AuthTextInput icon="lock" placeholder="Password" secureTextEntry />
        <PrimaryButton title="Sign Up" onPress={() => Alert.alert('Account created')} />
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
});
