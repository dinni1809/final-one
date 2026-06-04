import { zodResolver } from '@hookform/resolvers/zod';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { z } from 'zod';

import { PrimaryButton } from '@/components/buttons/PrimaryButton';
import { DecorativeDivider } from '@/components/common/DecorativeDivider';
import { LogoBadge } from '@/components/common/LogoBadge';
import { Screen } from '@/components/common/Screen';
import { AuthTextInput } from '@/components/forms/AuthTextInput';
import { useAuthStore } from '@/store/authStore';
import { authService } from '@/services/authService';
import { colors, radius, shadows, typography } from '@/theme';
import type { AuthStackParamList } from '@/types/navigation';
import { Feather } from '@expo/vector-icons';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

const schema = z.object({
  identifier: z.string().min(2, 'Enter your username or email'),
  password: z.string().min(4, 'Password is required'),
});

type FormValues = z.infer<typeof schema>;

export function LoginScreen({ navigation }: Props) {
  const [secure, setSecure] = useState(true);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);
  
  const login = useAuthStore((state) => state.login);
  const googleLogin = useAuthStore((state) => state.googleLogin);
  const { control, handleSubmit, formState } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { identifier: '', password: '' },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      setUnverifiedEmail(null);
      await login(values.identifier, values.password);
    } catch (error: any) {
      if (error.message === "Please verify your email before logging in.") {
        setUnverifiedEmail(values.identifier);
      }
      Alert.alert('Login failed', error instanceof Error ? error.message : 'Please try again');
    }
  });

  const onResendVerification = async () => {
    if (!unverifiedEmail) return;
    try {
      await authService.resendVerification(unverifiedEmail);
      Alert.alert("Success", "Verification email has been resent. Please check your inbox.");
      setUnverifiedEmail(null);
    } catch (error: any) {
      Alert.alert("Resend Failed", error.message || "Failed to resend verification email.");
    }
  };

  const onGoogle = async () => {
    setGoogleLoading(true);
    await googleLogin();
    setGoogleLoading(false);
  };

  return (
    <Screen>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.sketchLeft}>
            <Text style={styles.sketchText}>CAFE</Text>
          </View>
          <View style={styles.sketchRight} />
          <LogoBadge size={122} />
          <Text style={styles.title}>Welcome Back!</Text>
          <DecorativeDivider />
          <Text style={styles.subtitle}>Login to continue your journey</Text>

          <View style={styles.formCard}>
            <Controller
              name="identifier"
              control={control}
              render={({ field }) => (
                <AuthTextInput icon="user" placeholder="Username or Email" value={field.value} onChangeText={field.onChange} />
              )}
            />
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <AuthTextInput
                  icon="lock"
                  placeholder="Password"
                  value={field.value}
                  onChangeText={field.onChange}
                  secureTextEntry={secure}
                  rightIcon="eye"
                  onRightPress={() => setSecure((value) => !value)}
                />
              )}
            />
            {formState.errors.identifier || formState.errors.password ? (
              <Text style={styles.error}>{formState.errors.identifier?.message ?? formState.errors.password?.message}</Text>
            ) : null}

            {unverifiedEmail && (
              <View style={styles.unverifiedContainer}>
                <View style={styles.unverifiedHeader}>
                  <Feather name="alert-circle" size={16} color={colors.danger} style={{ marginRight: 6 }} />
                  <Text style={styles.unverifiedText}>
                    Please verify your email before logging in.
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.resendBtn}
                  activeOpacity={0.8}
                  onPress={onResendVerification}
                >
                  <Text style={styles.resendBtnText}>Resend Verification Email</Text>
                  <Feather name="send" size={12} color={colors.white} />
                </TouchableOpacity>
              </View>
            )}

            <TouchableOpacity style={styles.forgot} onPress={() => navigation.navigate('ForgotPassword')}>
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>
            <PrimaryButton title="Login" onPress={onSubmit} loading={formState.isSubmitting} />
            <View style={styles.orRow}>
              <View style={styles.orLine} />
              <Text style={styles.orText}>OR</Text>
              <View style={styles.orLine} />
            </View>
            <TouchableOpacity activeOpacity={0.78} style={styles.googleButton} onPress={onGoogle}>
              <Text style={styles.googleMark}>G</Text>
              <Text style={styles.googleText}>{googleLoading ? 'Signing in...' : 'Login with Google'}</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.signup} onPress={() => navigation.navigate('SignUp')}>
            <Text style={styles.signupText}>Don’t have an account? </Text>
            <Text style={styles.signupLink}>Sign Up</Text>
          </TouchableOpacity>
        </ScrollView>
        <LinearGradient colors={['rgba(255,255,255,0)', '#8B4E12']} style={styles.wave} />
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: {
    alignItems: 'center',
    minHeight: '100%',
    paddingBottom: 120,
    paddingHorizontal: 28,
    paddingTop: 54,
  },
  sketchLeft: {
    borderColor: '#D6A36E',
    borderWidth: 1,
    height: 250,
    left: -38,
    opacity: 0.38,
    position: 'absolute',
    top: 130,
    width: 122,
  },
  sketchText: {
    color: '#C27A35',
    fontFamily: 'Georgia',
    fontSize: 28,
    marginTop: 44,
    transform: [{ rotate: '6deg' }],
  },
  sketchRight: {
    borderColor: '#D6A36E',
    borderWidth: 1,
    height: 246,
    opacity: 0.36,
    position: 'absolute',
    right: -28,
    top: 110,
    width: 110,
  },
  title: {
    ...typography.display,
    color: colors.primaryDark,
    marginTop: 32,
    textAlign: 'center',
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 17,
    marginBottom: 24,
    marginTop: 18,
  },
  formCard: {
    backgroundColor: 'rgba(255,255,255,0.76)',
    borderColor: colors.white,
    borderRadius: radius.xl,
    borderWidth: 1,
    gap: 16,
    padding: 22,
    width: '100%',
    ...shadows.soft,
  },
  error: {
    color: colors.danger,
    fontSize: 12,
  },
  forgot: {
    alignSelf: 'flex-end',
    minHeight: 32,
  },
  forgotText: {
    color: colors.primaryDark,
    fontSize: 14,
    fontWeight: '700',
  },
  orRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'center',
    marginTop: 4,
  },
  orLine: {
    backgroundColor: colors.border,
    flex: 1,
    height: 1,
  },
  orText: {
    color: colors.primaryDark,
    fontWeight: '800',
  },
  googleButton: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'center',
    minHeight: 58,
  },
  googleMark: {
    color: '#4285F4',
    fontSize: 30,
    fontWeight: '900',
  },
  googleText: {
    color: '#111111',
    fontSize: 17,
    fontWeight: '800',
  },
  signup: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 34,
    minHeight: 44,
  },
  signupText: {
    color: colors.text,
    fontSize: 16,
  },
  signupLink: {
    color: colors.primaryDark,
    fontSize: 16,
    fontWeight: '900',
  },
  wave: {
    bottom: -40,
    height: 148,
    position: 'absolute',
    right: -30,
    transform: [{ rotate: '-8deg' }],
    width: 300,
  },
  unverifiedContainer: {
    backgroundColor: '#FCE8E6',
    borderColor: '#F5C2BE',
    borderWidth: 1,
    borderRadius: radius.md,
    padding: 12,
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  unverifiedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  unverifiedText: {
    color: colors.danger,
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
  },
  resendBtn: {
    backgroundColor: colors.primaryDark,
    borderRadius: radius.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
    ...shadows.soft,
  },
  resendBtnText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '800',
  },
});
