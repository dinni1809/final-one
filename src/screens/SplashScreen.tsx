import { useEffect, useMemo, useRef } from "react";
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

import { LogoBadge } from "@/components/common/LogoBadge";
import { colors, typography } from "@/theme";

type Props = {
  onFinish: () => void;
};

export function SplashScreen({ onFinish }: Props) {
  const { height } = useWindowDimensions();
  const initialY = useMemo(() => height * 0.6, [height]);
  const translateY = useRef(new Animated.Value(initialY)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const shineTranslate = useRef(new Animated.Value(-160)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 1900,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 700,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.delay(220),
          Animated.timing(shineTranslate, {
            toValue: 220,
            duration: 850,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
        ]),
      ]),
      Animated.delay(500),
    ]).start(() => onFinish());
  }, [onFinish, shineTranslate, textOpacity, translateY]);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.logoWrap, { transform: [{ translateY }] }]}>
        <View style={styles.logoFrame}>
          <LogoBadge size={160} />
          <Animated.View
            style={[
              styles.shine,
              {
                transform: [
                  { translateX: shineTranslate },
                  { rotate: "-25deg" },
                ],
              },
            ]}
          />
        </View>
      </Animated.View>

      <Animated.Text style={[styles.subtitle, { opacity: textOpacity }]}>
        Curated Dining. Made Effortless.
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "#F2E8DC",
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  logoWrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  logoFrame: {
    alignItems: "center",
    justifyContent: "center",
    height: 160,
    overflow: "hidden",
    width: 160,
  },
  shine: {
    backgroundColor: "rgba(255,255,255,0.28)",
    height: 220,
    left: -120,
    opacity: 0.8,
    position: "absolute",
    top: -30,
    width: 72,
  },
  subtitle: {
    color: "#4A2C1A",
    fontFamily: "Georgia",
    fontSize: 18,
    letterSpacing: 0.5,
    marginTop: 32,
    textAlign: "center",
  },
});
