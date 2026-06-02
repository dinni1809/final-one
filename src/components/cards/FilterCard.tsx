import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

import { colors, radius, shadows } from "@/theme";

type Props = {
  label: string;
  value: string;
  icon:
    | "map-pin"
    | "currency-inr"
    | "silverware-clean"
    | "bowl-hot"
    | "storefront-outline";
  onPress: () => void;
};

export function FilterCard({ label, value, icon, onPress }: Props) {
  return (
    <TouchableOpacity
      activeOpacity={0.78}
      onPress={onPress}
      style={styles.card}
    >
      {icon === "map-pin" ? (
        <Feather name="map-pin" size={31} color={colors.primaryDark} />
      ) : (
        <MaterialCommunityIcons
          name={icon as any}
          size={34}
          color={colors.primaryDark}
        />
      )}
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value} numberOfLines={1}>
        {value}
      </Text>
      <Feather name="chevron-down" size={18} color={colors.primaryDark} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    backgroundColor: colors.beigeSoft,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    gap: 7,
    marginRight: 10,
    minHeight: 138,
    paddingHorizontal: 10,
    paddingVertical: 16,
    width: 126,
    ...shadows.soft,
  },
  label: {
    color: colors.text,
    fontSize: 12,
    fontWeight: "800",
  },
  value: {
    color: colors.text,
    fontFamily: "Georgia",
    fontSize: 17,
    maxWidth: "100%",
  },
});
