import { Image } from 'expo-image';
import { StyleSheet } from 'react-native';

type Props = {
  size?: number;
};

const logo = require('../../../assets/faattsoo-logo.png');

export function LogoBadge({ size = 112 }: Props) {
  return (
    <Image
      source={logo}
      style={[styles.logo, { width: size, height: size, borderRadius: size / 2 }]}
      contentFit="cover"
    />
  );
}

const styles = StyleSheet.create({
  logo: {
    overflow: 'hidden',
  },
});
