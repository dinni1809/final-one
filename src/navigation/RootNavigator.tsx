import { NavigationContainer } from "@react-navigation/native";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useCallback, useState } from "react";

import { SplashScreen } from "@/screens/SplashScreen";
import { LogoBadge } from "@/components/common/LogoBadge";
import { colors } from "@/theme";
import { useAuthStore } from "@/store/authStore";

import { AppDrawerNavigator } from "./AppDrawerNavigator";
import { AuthNavigator } from "./AuthNavigator";

export function RootNavigator() {
  const isHydrating = useAuthStore((state) => state.isHydrating);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [splashFinished, setSplashFinished] = useState(false);

  const handleSplashFinish = useCallback(() => {
    setSplashFinished(true);
  }, []);

  if (!splashFinished || isHydrating) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <AppDrawerNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loader: {
    alignItems: "center",
    backgroundColor: colors.background,
    flex: 1,
    gap: 18,
    justifyContent: "center",
  },
});
