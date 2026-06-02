import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { colors, radius, shadows } from '@/theme';
import type { RatingSummary } from '@/types/restaurant';

type Props = {
  summary: RatingSummary;
};

export function RatingSummaryCard({ summary }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>Our Rating</Text>
      <View style={styles.scoreRow}>
        <Feather name="star" size={29} color={colors.warning} />
        <Text style={styles.score}>{summary.average.toFixed(1)}</Text>
      </View>
      <Text style={styles.reviews}>({summary.reviewCount} Reviews)</Text>
      {summary.breakdown.map((row) => (
        <View key={row.stars} style={styles.breakdown}>
          <Text style={styles.starText}>{row.stars} ★</Text>
          <View style={styles.barTrack}>
            <View style={[styles.bar, { width: `${row.percent}%` }]} />
          </View>
          <Text style={styles.percent}>{row.percent}%</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.beigeSoft,
    borderRadius: radius.md,
    gap: 7,
    padding: 18,
    ...shadows.soft,
  },
  label: {
    color: colors.primaryDark,
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
  scoreRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
  },
  score: {
    color: colors.primaryDark,
    fontSize: 34,
    fontWeight: '800',
  },
  reviews: {
    color: colors.primaryDark,
    fontSize: 12,
    textAlign: 'center',
  },
  breakdown: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 7,
  },
  starText: {
    color: colors.primaryDark,
    fontSize: 11,
    width: 26,
  },
  barTrack: {
    backgroundColor: colors.border,
    borderRadius: 8,
    flex: 1,
    height: 5,
    overflow: 'hidden',
  },
  bar: {
    backgroundColor: colors.primary,
    height: '100%',
  },
  percent: {
    color: colors.primaryDark,
    fontSize: 11,
    width: 28,
  },
});
