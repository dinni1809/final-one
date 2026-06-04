import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Image } from "expo-image";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { Screen } from "@/components/common/Screen";
import { useAuthStore } from "@/store/authStore";
import { useFavoriteStore } from "@/store/favoriteStore";
import { colors, radius, shadows, typography } from "@/theme";

export function ProfileScreen() {
  const navigation = useNavigation();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const savedCount = useFavoriteStore((state) => state.restaurants.length);

  const getInitials = (name?: string) => {
    if (!name) return "FG";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.header}>
          {user?.avatar ? (
            <Image source={{ uri: user.avatar }} style={styles.avatar} contentFit="cover" />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarInitials}>{getInitials(user?.name)}</Text>
            </View>
          )}
          <Text style={styles.name}>{user?.name ?? "FAATTSOO Guest"}</Text>
          <Text style={styles.username}>@{user?.username ?? "guestuser"}</Text>
          <Text style={styles.email}>{user?.email ?? "guest@faattsoo.local"}</Text>
        </View>

        {/* Account Stats Section */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <View style={[styles.statIconContainer, { backgroundColor: "#FCE8E6" }]}>
              <Feather name="heart" size={18} color={colors.danger} />
            </View>
            <Text style={styles.statNumber}>{savedCount}</Text>
            <Text style={styles.statLabel}>Saved</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIconContainer, { backgroundColor: "#FEF2D9" }]}>
              <Feather name="star" size={18} color={colors.warning} />
            </View>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Reviews</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIconContainer, { backgroundColor: "#E9F1DF" }]}>
              <Feather name="calendar" size={18} color={colors.primary} />
            </View>
            <Text style={styles.statNumber}>2026</Text>
            <Text style={styles.statLabel}>Joined</Text>
          </View>
        </View>

        {/* Quick Actions List Section */}
        <View style={styles.settingsGroup}>
          <TouchableOpacity activeOpacity={0.7} style={styles.settingsRow}>
            <View style={styles.settingsLabelContainer}>
              <Feather name="user" size={18} color={colors.primary} />
              <Text style={styles.settingsText}>Profile Information</Text>
            </View>
            <Feather name="chevron-right" size={16} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.settingsRow}
            onPress={() => navigation.navigate("Notifications" as never)}
          >
            <View style={styles.settingsLabelContainer}>
              <Feather name="bell" size={18} color={colors.primary} />
              <Text style={styles.settingsText}>Notification Preferences</Text>
            </View>
            <Feather name="chevron-right" size={16} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.7} style={styles.settingsRow}>
            <View style={styles.settingsLabelContainer}>
              <Feather name="lock" size={18} color={colors.primary} />
              <Text style={styles.settingsText}>Privacy Settings</Text>
            </View>
            <Feather name="chevron-right" size={16} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.7} style={styles.settingsRow}>
            <View style={styles.settingsLabelContainer}>
              <Feather name="help-circle" size={18} color={colors.primary} />
              <Text style={styles.settingsText}>Help & Support</Text>
            </View>
            <Feather name="chevron-right" size={16} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.7} style={[styles.settingsRow, { borderBottomWidth: 0 }]}>
            <View style={styles.settingsLabelContainer}>
              <Feather name="info" size={18} color={colors.primary} />
              <Text style={styles.settingsText}>About FAATTSOO</Text>
            </View>
            <Feather name="chevron-right" size={16} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Account Control Section */}
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.logoutBtn}
          onPress={() => void logout()}
        >
          <Feather name="log-out" size={18} color={colors.danger} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 20,
    paddingTop: 40,
    paddingBottom: 110,
    gap: 20,
  },
  header: {
    alignItems: "center",
    paddingVertical: 12,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: colors.border,
    ...shadows.soft,
  },
  avatarPlaceholder: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: colors.primaryDark,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    ...shadows.soft,
  },
  avatarInitials: {
    color: colors.white,
    fontFamily: "Georgia",
    fontSize: 32,
    fontWeight: "700",
  },
  name: {
    color: colors.primaryDark,
    fontFamily: "Georgia",
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
  },
  username: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "700",
    marginTop: 2,
  },
  email: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: 4,
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.beigeSoft,
    borderRadius: radius.md,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.soft,
    gap: 4,
  },
  statIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  statNumber: {
    color: colors.primaryDark,
    fontSize: 18,
    fontWeight: "800",
  },
  statLabel: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  settingsGroup: {
    backgroundColor: colors.beigeSoft,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
    ...shadows.soft,
  },
  settingsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingsLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  settingsText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "700",
  },
  logoutBtn: {
    backgroundColor: "#FCE8E6",
    borderColor: "#F5C2BE",
    borderWidth: 1,
    borderRadius: radius.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    ...shadows.soft,
  },
  logoutText: {
    color: colors.danger,
    fontSize: 15,
    fontWeight: "800",
  },
});
