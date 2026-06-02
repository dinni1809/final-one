import { Feather } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import { colors, radius, shadows } from "@/theme";
import type { Review } from "@/types/restaurant";

type Props = {
  review: Review;
};

export function ReviewCard({ review }: Props) {
  const date = review.createdAt
    ? new Date(review.createdAt).toLocaleDateString()
    : "";

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.user}>{review.userName}</Text>
        <View style={styles.stars}>
          {Array.from({ length: 5 }, (_, index) => (
            <Feather
              key={index}
              name="star"
              size={13}
              color={index < review.rating ? colors.warning : colors.border}
            />
          ))}
        </View>
      </View>
      <Text style={styles.title}>{review.title}</Text>
      <Text style={styles.body}>{review.body}</Text>
      <Text style={styles.date}>{date}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.beigeSoft,
    borderRadius: radius.md,
    padding: 16,
    marginTop: 12,
    ...shadows.soft,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  user: {
    color: colors.primaryDark,
    fontSize: 14,
    fontWeight: "700",
  },
  stars: {
    alignItems: "center",
    flexDirection: "row",
    gap: 2,
  },
  title: {
    color: colors.primaryDark,
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
  },
  body: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 10,
  },
  date: {
    color: colors.textSecondary,
    fontSize: 12,
  },
});
