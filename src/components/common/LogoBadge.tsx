import { StyleSheet, Text, View } from 'react-native';

import { colors, radius, shadows } from '@/theme';

type Props = {
  size?: number;
};

export function LogoBadge({ size = 112 }: Props) {
  const faceSize = size * 0.35;
  return (
    <View style={[styles.wrap, { width: size, height: size, borderRadius: size / 2 }]}>
      <View style={styles.grid}>
        <View style={[styles.face, { width: faceSize, height: faceSize, borderRadius: faceSize / 2 }]}>
          <Text style={styles.faceText}>O</Text>
        </View>
        <Text style={[styles.brand, { fontSize: size * 0.13 }]}>FAATTSOO</Text>
        <Text style={[styles.tag, { fontSize: size * 0.055 }]}>EAT. ROAM. REPEAT</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF9F5',
    borderWidth: 2,
    borderColor: colors.white,
    ...shadows.soft,
  },
  grid: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(230,221,213,0.32)',
    borderRadius: radius.pill,
  },
  face: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8B95B',
    borderWidth: 2,
    borderColor: colors.text,
    marginBottom: 4,
  },
  faceText: {
    color: colors.text,
    fontWeight: '900',
  },
  brand: {
    color: colors.text,
    fontWeight: '900',
    letterSpacing: 1,
  },
  tag: {
    color: colors.text,
    fontWeight: '800',
    letterSpacing: 2,
  },
});
