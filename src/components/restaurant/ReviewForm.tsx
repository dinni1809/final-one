import { Feather } from "@expo/vector-icons";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { colors, radius, shadows, typography } from "@/theme";

type Props = {
  rating: number;
  title: string;
  body: string;
  loading?: boolean;
  onRatingChange: (rating: number) => void;
  onTitleChange: (text: string) => void;
  onBodyChange: (text: string) => void;
  onSubmit: () => void;
};

export function ReviewForm({
  rating,
  title,
  body,
  loading,
  onRatingChange,
  onTitleChange,
  onBodyChange,
  onSubmit,
}: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.heading}>Leave a review</Text>
      <Text style={styles.subtext}>
        Share your experience with other guests.
      </Text>
      <View style={styles.ratingRow}>
        {Array.from({ length: 5 }, (_, index) => {
          const value = index + 1;
          return (
            <TouchableOpacity
              key={value}
              activeOpacity={0.72}
              style={styles.starButton}
              onPress={() => onRatingChange(value)}
            >
              <Feather
                name="star"
                size={24}
                color={value <= rating ? colors.warning : colors.border}
              />
            </TouchableOpacity>
          );
        })}
      </View>
      <TextInput
        value={title}
        onChangeText={onTitleChange}
        placeholder="Review title"
        placeholderTextColor={colors.textSecondary}
        style={styles.input}
      />
      <TextInput
        value={body}
        onChangeText={onBodyChange}
        placeholder="Write your review..."
        placeholderTextColor={colors.textSecondary}
        style={[styles.input, styles.textarea]}
        multiline
        textAlignVertical="top"
      />
      <PrimaryButton
        title="Submit Review"
        onPress={onSubmit}
        loading={loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.beigeSoft,
    borderRadius: radius.md,
    gap: 12,
    padding: 18,
    marginTop: 20,
    ...shadows.soft,
  },
  heading: {
    color: colors.primaryDark,
    fontSize: 18,
    fontWeight: "800",
  },
  subtext: {
    color: colors.textSecondary,
    fontSize: 13,
    marginBottom: 12,
  },
  ratingRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  starButton: {
    padding: 4,
  },
  input: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    color: colors.primaryDark,
    fontSize: 14,
    minHeight: 48,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  textarea: {
    minHeight: 110,
  },
});
