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

type Props = {
  onFinish: () => void;
};

export function SplashScreen({ onFinish }: Props) {
  const { height } = useWindowDimensions();

  const initialY = useMemo(() => height * 0.65, [height]);

  const translateY = useRef(new Animated.Value(initialY)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const shineTranslate = useRef(new Animated.Value(-220)).current;

  useEffect(() => {
    const animation = Animated.sequence([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 2300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),

      Animated.parallel([
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 900,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),

        Animated.sequence([
          Animated.delay(300),

          Animated.timing(shineTranslate, {
            toValue: 260,
            duration: 1300,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
        ]),
      ]),

      Animated.delay(1800),
    ]);

    animation.start((result) => {
      if (result.finished) {
        onFinish();
      }
    });

    return () => {
      animation.stop();
    };
  }, [onFinish, translateY, textOpacity, shineTranslate]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.logoWrap,
          {
            transform: [{ translateY }],
          },
        ]}
      >
        <View style={styles.logoFrame}>
          <LogoBadge size={170} />

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

      <Animated.View
        style={{
          opacity: textOpacity,
        }}
      >
        <Text style={styles.subtitle}>
          Curated Dining. Made Effortless.
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4EBDD",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  logoWrap: {
    alignItems: "center",
    justifyContent: "center",
  },

  logoFrame: {
    width: 170,
    height: 170,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  shine: {
    position: "absolute",
    top: -50,
    left: -180,

    width: 60,
    height: 280,

    backgroundColor: "rgba(255,255,255,0.28)",

    opacity: 0.55,
  },

  subtitle: {
    marginTop: 36,

    color: "#4A2C1A",

    fontSize: 22,
    fontWeight: "600",

    letterSpacing: 0.6,

    textAlign: "center",

    fontFamily: "Georgia",
  },
});