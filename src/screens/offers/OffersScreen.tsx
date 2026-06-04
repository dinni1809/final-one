import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Image } from "expo-image";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";

import { IconButton } from "@/components/common/IconButton";
import { LogoBadge } from "@/components/common/LogoBadge";
import { Screen } from "@/components/common/Screen";
import { colors, radius, shadows, typography } from "@/theme";

const DEALS = [
  {
    id: "deal-1",
    restaurantId: "69eee48b96de99de33ec1c52",
    restaurantName: "Revival - Marriott",
    title: "50% OFF Main Course",
    ends: "Ends: 10 June",
    badge: "3 days left",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=600&h=400&q=82",
  },
  {
    id: "deal-2",
    restaurantId: "69eee48b96de99de33ec1c55",
    restaurantName: "Glen's Bakehouse",
    title: "Buy 1 Get 1 Mocktail",
    ends: "Ends: 12 June",
    badge: "5 days left",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&h=400&q=82",
  },
  {
    id: "deal-3",
    restaurantId: "69eee48b96de99de33ec1c57",
    restaurantName: "Corner House",
    title: "20% OFF Desserts",
    ends: "Ends: 15 June",
    badge: "8 days left",
    image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=600&h=400&q=82",
  },
];

const REWARDS = [
  {
    id: "reward-1",
    title: "Birthday Week Reward",
    emoji: "🎂",
    badge: "BIRTHDAY SPECIAL",
    validUntil: "Valid till: 31 Dec 2026",
    description: "Enjoy a complimentary signature dessert and flat 15% discount on your entire table during your birthday week.",
  },
  {
    id: "reward-2",
    title: "Student Special",
    emoji: "🎓",
    badge: "STUDENT DEAL",
    validUntil: "Valid till: 30 Sept 2026",
    description: "Flash your valid student ID card to receive a free mocktail or beverage with any main course purchase.",
  },
  {
    id: "reward-3",
    title: "Corporate Lunch Deal",
    emoji: "💼",
    badge: "CORP LUNCH",
    validUntil: "Valid till: 31 Dec 2026",
    description: "Flat 15% discount on all corporate lunchtime orders above ₹1,500 between 12:00 PM and 3:30 PM.",
  },
  {
    id: "reward-4",
    title: "Name Lucky Offer",
    emoji: "🎉",
    badge: "LUCKY DRAW",
    validUntil: "Weekly Draw",
    description: "Is your name starts with 'D' or 'S'? Congratulations! Get a free chef's special mocktail with every order today.",
  },
];

const MYSTERY_REWARDS = [
  "5% OFF Total Bill",
  "10% OFF Total Bill",
  "15% OFF Total Bill",
  "Free Dessert Coupon",
  "Free Drink Coupon",
];

export function OffersScreen() {
  const navigation = useNavigation<any>();
  const [mysteryState, setMysteryState] = useState<"idle" | "shuffling" | "revealed" | "claimed">("idle");
  const [revealedReward, setRevealedReward] = useState("");

  const handleReveal = () => {
    if (mysteryState === "shuffling") return;
    setMysteryState("shuffling");
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * MYSTERY_REWARDS.length);
      setRevealedReward(MYSTERY_REWARDS[randomIndex]);
      setMysteryState("revealed");
    }, 1200);
  };

  const handleClaim = () => {
    setMysteryState("claimed");
    setTimeout(() => {
      handleReset();
    }, 2000);
  };

  const handleReset = () => {
    setMysteryState("idle");
    setRevealedReward("");
  };

  return (
    <Screen>
      <View style={styles.header}>
        <IconButton name="chevron-left" onPress={() => navigation.goBack()} />
        <View style={styles.titleRow}>
          <LogoBadge size={48} />
          <Text style={styles.title}>Offers & Rewards</Text>
        </View>
        <View style={styles.spacer} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.heroSection}>
          <Text style={styles.heroEmoji}>🔥</Text>
          <Text style={styles.heroTitle}>Offers & Rewards</Text>
          <Text style={styles.heroSubtitle}>Discover exclusive deals and loyalty rewards.</Text>
        </View>

        {/* Section 1: Restaurant Deals */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Feather name="tag" size={18} color={colors.primary} />
            <Text style={styles.sectionTitle}>Restaurant Deals</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dealsCarousel}>
            {DEALS.map((deal) => (
              <TouchableOpacity
                key={deal.id}
                activeOpacity={0.8}
                style={styles.dealCard}
                onPress={() =>
                  navigation.navigate("RestaurantDetails" as never, {
                    restaurantId: deal.restaurantId,
                  } as never)
                }
              >
                <View style={styles.imageContainer}>
                  <Image source={{ uri: deal.image }} style={styles.dealImage} contentFit="cover" />
                  <View style={styles.daysBadge}>
                    <Text style={styles.daysBadgeText}>{deal.badge}</Text>
                  </View>
                </View>
                <View style={styles.dealBody}>
                  <Text style={styles.dealName} numberOfLines={1}>{deal.restaurantName}</Text>
                  <Text style={styles.dealTitle}>{deal.title}</Text>
                  <Text style={styles.dealEnds}>{deal.ends}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Section 2: FAATTSOO Rewards */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Feather name="award" size={18} color={colors.primary} />
            <Text style={styles.sectionTitle}>FAATTSOO Rewards</Text>
          </View>
          <View style={styles.rewardsList}>
            {REWARDS.map((reward) => (
              <View key={reward.id} style={styles.rewardCard}>
                <View style={styles.rewardHeader}>
                  <Text style={styles.rewardEmoji}>{reward.emoji}</Text>
                  <View style={styles.rewardTitleContainer}>
                    <Text style={styles.rewardCardTitle}>{reward.title}</Text>
                    <Text style={styles.rewardValid}>{reward.validUntil}</Text>
                  </View>
                  <View style={styles.rewardBadge}>
                    <Text style={styles.rewardBadgeText}>{reward.badge}</Text>
                  </View>
                </View>
                <Text style={styles.rewardDescription}>{reward.description}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Section 3: Mystery Reward */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Feather name="help-circle" size={18} color={colors.primary} />
            <Text style={styles.sectionTitle}>Mystery Reward</Text>
          </View>
          <View style={styles.mysteryCard}>
            {mysteryState === "idle" && (
              <TouchableOpacity activeOpacity={0.85} onPress={handleReveal} style={styles.mysteryContent}>
                <View style={styles.mysteryIconContainer}>
                  <Text style={styles.mysteryDice}>🎲</Text>
                </View>
                <Text style={styles.mysteryTitleText}>Tap to Reveal</Text>
                <Text style={styles.mysterySubtitleText}>Unlock a random rewards coupon immediately!</Text>
                <TouchableOpacity activeOpacity={0.75} onPress={handleReveal} style={styles.revealBtn}>
                  <Text style={styles.revealBtnText}>Reveal Reward</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            )}

            {mysteryState === "shuffling" && (
              <View style={styles.mysteryContent}>
                <ActivityIndicator size="large" color={colors.primary} style={{ marginBottom: 12 }} />
                <Text style={styles.mysteryTitleText}>Shuffling Rewards...</Text>
                <Text style={styles.mysterySubtitleText}>Curating your exclusive dining gift.</Text>
              </View>
            )}

            {mysteryState === "revealed" && (
              <View style={styles.mysteryContent}>
                <View style={styles.revealedGiftContainer}>
                  <Text style={styles.revealedGiftEmoji}>🎁</Text>
                </View>
                <Text style={styles.revealedLabel}>Your Reward:</Text>
                <Text style={styles.revealedValue}>{revealedReward}</Text>
                <Text style={styles.claimCode}>Use Code: FAATTSOOPRIZE</Text>
                <View style={styles.actionRow}>
                  <TouchableOpacity activeOpacity={0.75} onPress={handleReset} style={styles.tryAgainBtn}>
                    <Text style={styles.tryAgainText}>Reset</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.75}
                    onPress={handleClaim}
                    style={styles.claimBtn}
                  >
                    <Text style={styles.claimBtnText}>Claim Reward</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {mysteryState === "claimed" && (
              <View style={styles.mysteryContent}>
                <View style={styles.claimedSuccessContainer}>
                  <Feather name="check-circle" size={42} color={colors.success} />
                </View>
                <Text style={styles.mysteryTitleText}>Reward Claimed!</Text>
                <Text style={styles.mysterySubtitleText}>
                  Your discount coupon has been added to your account and will be applied at checkout.
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.background,
  },
  title: { ...typography.h2, color: colors.primaryDark },
  titleRow: { alignItems: "center", flexDirection: "row", gap: 10 },
  spacer: { width: 44 },
  scrollContent: {
    paddingBottom: 48,
  },
  heroSection: {
    alignItems: "center",
    paddingVertical: 24,
    paddingHorizontal: 20,
    backgroundColor: colors.beigeSoft,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  heroEmoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  heroTitle: {
    color: colors.primaryDark,
    fontFamily: "Georgia",
    fontSize: 28,
    fontWeight: "700",
  },
  heroSubtitle: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: "center",
    marginTop: 4,
  },
  sectionContainer: {
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    color: colors.primaryDark,
    fontFamily: "Georgia",
    fontSize: 18,
    fontWeight: "700",
  },
  dealsCarousel: {
    paddingLeft: 16,
    paddingRight: 8,
    gap: 12,
  },
  dealCard: {
    backgroundColor: colors.beigeSoft,
    borderRadius: radius.md,
    overflow: "hidden",
    width: 220,
    ...shadows.card,
  },
  imageContainer: {
    height: 120,
    width: "100%",
  },
  dealImage: {
    height: "100%",
    width: "100%",
  },
  daysBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: colors.primaryDark,
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  daysBadgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: "800",
  },
  dealBody: {
    padding: 10,
    gap: 4,
  },
  dealName: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  dealTitle: {
    color: colors.primaryDark,
    fontSize: 16,
    fontWeight: "800",
  },
  dealEnds: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  rewardsList: {
    marginHorizontal: 16,
    gap: 12,
  },
  rewardCard: {
    backgroundColor: colors.beigeSoft,
    borderRadius: radius.md,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.soft,
  },
  rewardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 8,
  },
  rewardEmoji: {
    fontSize: 26,
  },
  rewardTitleContainer: {
    flex: 1,
  },
  rewardCardTitle: {
    color: colors.primaryDark,
    fontSize: 15,
    fontWeight: "800",
  },
  rewardValid: {
    color: colors.textSecondary,
    fontSize: 11,
  },
  rewardBadge: {
    backgroundColor: colors.primary,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  rewardBadgeText: {
    color: colors.white,
    fontSize: 9,
    fontWeight: "800",
  },
  rewardDescription: {
    color: colors.text,
    fontSize: 13,
    lineHeight: 18,
  },
  mysteryCard: {
    marginHorizontal: 16,
    backgroundColor: colors.beigeSoft,
    borderRadius: radius.lg,
    borderStyle: "dashed",
    borderWidth: 2,
    borderColor: colors.line,
    padding: 24,
    ...shadows.soft,
    alignItems: "center",
    justifyContent: "center",
  },
  mysteryContent: {
    alignItems: "center",
    width: "100%",
  },
  mysteryIconContainer: {
    backgroundColor: colors.beige,
    borderRadius: radius.pill,
    padding: 16,
    marginBottom: 10,
  },
  mysteryDice: {
    fontSize: 36,
  },
  mysteryTitleText: {
    color: colors.primaryDark,
    fontSize: 18,
    fontWeight: "800",
    fontFamily: "Georgia",
  },
  mysterySubtitleText: {
    color: colors.textSecondary,
    fontSize: 13,
    textAlign: "center",
    marginTop: 4,
    marginBottom: 16,
  },
  revealBtn: {
    backgroundColor: colors.primaryDark,
    borderRadius: radius.md,
    paddingVertical: 12,
    paddingHorizontal: 24,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  revealBtnText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "800",
  },
  revealedGiftContainer: {
    backgroundColor: "#FCE8D5",
    borderRadius: radius.pill,
    padding: 16,
    marginBottom: 8,
  },
  revealedGiftEmoji: {
    fontSize: 36,
  },
  revealedLabel: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  revealedValue: {
    color: colors.primaryDark,
    fontSize: 24,
    fontWeight: "800",
    textAlign: "center",
    marginTop: 4,
    fontFamily: "Georgia",
  },
  claimCode: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "700",
    marginTop: 4,
    backgroundColor: colors.beige,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
  },
  actionRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
    width: "100%",
  },
  tryAgainBtn: {
    flex: 1,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  tryAgainText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: "800",
  },
  claimBtn: {
    flex: 2,
    backgroundColor: colors.success,
    borderRadius: radius.md,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  claimBtnText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "800",
  },
  claimedSuccessContainer: {
    backgroundColor: "#E2F0D9",
    borderRadius: radius.pill,
    padding: 16,
    marginBottom: 12,
  },
});
