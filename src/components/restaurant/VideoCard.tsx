import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { colors, radius, shadows } from '@/theme';

type Props = {
  image: string;
  title: string;
  onPress: () => void;
};

export function VideoCard({ image, title, onPress }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.heading}>FAATTSOO Video</Text>
      <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={styles.thumbWrap}>
        <Image source={{ uri: image }} style={styles.thumb} contentFit="cover" />
        <View style={styles.play}>
          <Feather name="play" size={34} color={colors.white} />
        </View>
        <Feather name="maximize-2" size={20} color={colors.white} style={styles.expand} />
      </TouchableOpacity>
      <View style={styles.footer}>
        <Text style={styles.title}>{title}</Text>
        <TouchableOpacity onPress={onPress} style={styles.circle}>
          <Feather name="arrow-right" size={22} color={colors.primaryDark} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.beigeSoft,
    borderRadius: radius.md,
    gap: 12,
    padding: 16,
    ...shadows.soft,
  },
  heading: {
    color: colors.primaryDark,
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
  thumbWrap: {
    borderRadius: radius.sm,
    height: 150,
    overflow: 'hidden',
  },
  thumb: {
    height: '100%',
    width: '100%',
  },
  play: {
    alignItems: 'center',
    backgroundColor: colors.overlay,
    borderColor: colors.white,
    borderRadius: 34,
    borderWidth: 1,
    height: 68,
    justifyContent: 'center',
    left: '50%',
    marginLeft: -34,
    marginTop: -34,
    position: 'absolute',
    top: '50%',
    width: 68,
  },
  expand: {
    position: 'absolute',
    right: 12,
    top: 12,
  },
  footer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    color: colors.text,
    flex: 1,
    fontFamily: 'Georgia',
    fontSize: 16,
    lineHeight: 22,
  },
  circle: {
    alignItems: 'center',
    borderColor: colors.border,
    borderRadius: 22,
    borderWidth: 1,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
});
