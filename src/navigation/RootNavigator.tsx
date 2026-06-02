import { NavigationContainer } from '@react-navigation/native';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { colors } from '@/theme';
import { useAuthStore } from '@/store/authStore';

import { AppDrawerNavigator } from './AppDrawerNavigator';
import { AuthNavigator } from './AuthNavigator';

export function RootNavigator() {
  const isHydrating = useAuthStore((state) => state.isHydrating);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (isHydrating) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return <NavigationContainer>{isAuthenticated ? <AppDrawerNavigator /> : <AuthNavigator />}</NavigationContainer>;
}

const styles = StyleSheet.create({
  loader: {
    alignItems: 'center',
    backgroundColor: colors.background,
    flex: 1,
    justifyContent: 'center',
  },
});
