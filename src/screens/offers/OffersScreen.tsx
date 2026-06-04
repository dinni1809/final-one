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
import { useRestaurants } from "@/hooks/useRestaurants";
import { colors, radius, shadows, typography } from "@/theme";
import type { Restaurant } from "@/types/restaurant";

const DEALS = [
  {
    id: "deal-1",
    restaurantId: "69eee48b96de99de33ec1c52",
    restaurantName: "Revival - Marriott",
    title: "50% OFF Main Course",
    ends: "Ends: 10 June",
    badge: "3 days left",
  },
  {
    id: "deal-2",
    restaurantId: "69eee48b96de99de33ec1c55",
    restaurantName: "Glen's Bakehouse",
    title: "Buy 1 Get 1 Mocktail",
    ends: "Ends: 12 June",
    badge: "5 days left",
  },
  {
    id: "deal-3",
    restaurantId: "69eee48b96de99de33ec1c57",
    restaurantName: "Corner House",
    title: "20% OFF Desserts",
    ends: "Ends: 15 June",
    badge: "8 days left",
  },
];

const SPECIAL_OFFERS = [
  {
    id: "special-1",
    restaurantId: "69eee48b96de99de33ec1c55",
    restaurantName: "Glen's Bakehouse",
    title: "Birthday Week Special",
    reward: "Free Dessert",
    ends: "Ends: 20 June",
    badge: "3 days left",
  },
  {
    id: "special-2",
    restaurantId: "69eee48b96de99de33ec1c52",
    restaurantName: "Revival - Marriott",
    title: "Corporate Lunch Offer",
    reward: "Free Beverage",
    ends: "Ends: 15 June",
    badge: "5 days left",
  },
  {
    id: "special-3",
    restaurantId: "69eee48b96de99de33ec1c57",
    restaurantName: "Corner House",
    title: "Student Special",
    reward: "10% OFF",
    ends: "Ends: 30 June",
    badge: "10 days left",
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

  const { data: restaurants = [] } = useRestaurants();

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

  // Helper to fetch the actual resolved image from the database
  const getRestaurantImage = (restaurantId: string) => {
    const matched = (restaurants as Restaurant[]).find((r) => r.id === restaurantId);
    return matched?.image || "https://images.unsplash.com/photo-1504674900247-0877df9cc836"; // Fallback URL
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
                  <Image
                    source={{ uri: getRestaurantImage(deal.restaurantId) }}
                    style={styles.dealImage}
                    contentFit="cover"
                  />
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

        {/* Section 2: Special Restaurant Offers */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Feather name="award" size={18} color={colors.primary} />
            <Text style={styles.sectionTitle}>Special Restaurant Offers</Text>
          </View>
          <View style={styles.specialOffersList}>
            {SPECIAL_OFFERS.map((offer) => (
              <TouchableOpacity
                key={offer.id}
                activeOpacity={0.8}
                style={styles.specialOfferCard}
                onPress={() =>
                  navigation.navigate("RestaurantDetails" as never, {
                    restaurantId: offer.restaurantId,
                  } as never)
                }
              >
                <Image
                  source={{ uri: getRestaurantImage(offer.restaurantId) }}
                  style={styles.specialOfferImage}
                  contentFit="cover"
                />
                <View style={styles.specialOfferContent}>
                  <Text style={styles.specialOfferRestaurant} numberOfLines={1}>
                    {offer.restaurantName}
                  </Text>
                  <Text style={styles.specialOfferTitle} numberOfLines={1}>
                    {offer.title}
                  </Text>
                  <Text style={styles.specialOfferReward}>
                    🎁 {offer.reward}
                  </Text>
                  <Text style={styles.specialOfferEnds}>{offer.ends}</Text>
                </View>
                <View style={styles.specialUrgencyBadge}>
                  <Text style={styles.specialUrgencyText}>{offer.badge}</Text>
                </View>
              </TouchableOpacity>
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
  sectionContainer: {
    marginTop: 20,
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
    backgroundColor: colors.danger, // Crimson urgency color!
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
  specialOffersList: {
    marginHorizontal: 16,
    gap: 12,
  },
  specialOfferCard: {
    backgroundColor: colors.beigeSoft,
    borderRadius: radius.md,
    flexDirection: "row",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.soft,
    position: "relative",
  },
  specialOfferImage: {
    width: 100,
    height: "100%",
    minHeight: 110,
  },
  specialOfferContent: {
    flex: 1,
    padding: 12,
    gap: 4,
    justifyContent: "center",
  },
  specialOfferRestaurant: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  specialOfferTitle: {
    color: colors.primaryDark,
    fontFamily: "Georgia",
    fontSize: 15,
    fontWeight: "700",
    paddingRight: 60, // Space for urgency badge
  },
  specialOfferReward: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "700",
    marginTop: 2,
  },
  specialOfferEnds: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  specialUrgencyBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: colors.danger, // Crimson urgency color!
    borderRadius: radius.pill,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  specialUrgencyText: {
    color: colors.white,
    fontSize: 9,
    fontWeight: "800",
    textTransform: "uppercase",
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
