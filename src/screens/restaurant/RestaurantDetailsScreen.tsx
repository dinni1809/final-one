import { Feather } from "@expo/vector-icons";
import {
  DrawerActions,
  RouteProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import * as Linking from "expo-linking";
import { useState, useRef } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { CategoryTabs } from "@/components/restaurant/CategoryTabs";
import { FavoriteButton } from "@/components/restaurant/FavoriteButton";
import { MenuCard } from "@/components/restaurant/MenuCard";
import { RatingSummaryCard } from "@/components/restaurant/RatingSummaryCard";
import { ReviewCard } from "@/components/restaurant/ReviewCard";
import { ReviewForm } from "@/components/restaurant/ReviewForm";
import { VideoCard } from "@/components/restaurant/VideoCard";
import { IconButton } from "@/components/common/IconButton";
import { LogoBadge } from "@/components/common/LogoBadge";
import { Screen } from "@/components/common/Screen";
import { SearchBar } from "@/components/forms/SearchBar";
import { useMenu } from "@/hooks/useMenu";
import { useRatingSummary } from "@/hooks/useRating";
import { useRestaurantDetails } from "@/hooks/useRestaurants";
import { useReviews, useSubmitReview } from "@/hooks/useReviews";
import { colors, radius, shadows, typography } from "@/theme";
import type { MenuCategory, MenuItem, Review } from "@/types/restaurant";

type DetailsRoute = RouteProp<
  { RestaurantDetails: { restaurantId: string } },
  "RestaurantDetails"
>;

export function RestaurantDetailsScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<DetailsRoute>();
  const restaurantId = route.params?.restaurantId ?? "olive-bistro";
  const [category, setCategory] = useState<MenuCategory>("All");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewBody, setReviewBody] = useState("");
  const { data: restaurant } = useRestaurantDetails(restaurantId);
  const { data: menu = [] } = useMenu(restaurantId, category);
  const { data: rating } = useRatingSummary(restaurantId);
  const { data: reviews = [], isLoading: reviewsLoading } = useReviews(
    restaurantId,
  ) as {
    data?: Review[];
    isLoading: boolean;
  };
  const submitReview = useSubmitReview(restaurantId);
  const isSubmittingReview = submitReview.status === "pending";
  const scrollViewRef = useRef<ScrollView>(null);
  const [menuY, setMenuY] = useState(0);

  const handleCategorySelect = (selectedCat: MenuCategory) => {
    setCategory(selectedCat);
    if (menuY > 0) {
      scrollViewRef.current?.scrollTo({ y: menuY - 10, animated: true });
    }
  };

  const handleSubmitReview = async () => {
    if (!reviewTitle.trim() || !reviewBody.trim()) {
      Alert.alert(
        "Review missing",
        "Please add a title and review content before submitting.",
      );
      return;
    }

    try {
      await submitReview.mutateAsync({
        rating: reviewRating,
        title: reviewTitle.trim(),
        body: reviewBody.trim(),
      });
      setReviewRating(5);
      setReviewTitle("");
      setReviewBody("");
    } catch (error) {
      Alert.alert(
        "Failed to submit review",
        (error as Error).message || "Please try again later.",
      );
    }
  };

  if (!restaurant || !rating) {
    return <Screen />;
  }

  return (
    <Screen>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[4]}
      >
        <View style={styles.topNav}>
          <LogoBadge size={66} />
          <SearchBar onPress={() => navigation.navigate("Search" as never)} />
          <IconButton
            name="heart"
            size={25}
            onPress={() => navigation.navigate("Bookmarks" as never)}
          />
          <IconButton
            name="user"
            size={25}
            onPress={() => navigation.navigate("Profile" as never)}
          />
          <IconButton
            name="menu"
            size={27}
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          />
        </View>

        <View style={styles.banner}>
          <Image
            source={{ uri: restaurant.coverImage }}
            style={StyleSheet.absoluteFill}
            contentFit="cover"
          />
          <LinearGradient
            colors={["rgba(43,29,18,0)", "rgba(43,29,18,0.76)"]}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.bannerButtons}>
            <IconButton
              name="chevron-left"
              filled
              onPress={() => navigation.goBack()}
            />
            <FavoriteButton id={restaurant.id} />
          </View>
          <View style={styles.bannerText}>
            <Text style={styles.restaurantName}>{restaurant.name}</Text>
            <View style={styles.metaRow}>
              <Text style={styles.bannerMeta}>
                {restaurant.cuisines.join(", ")}
              </Text>
              <Text style={styles.bannerMeta}>•</Text>
              <Feather name="map-pin" size={14} color={colors.white} />
              <Text style={styles.bannerMeta}>
                {restaurant.area}, {restaurant.city}
              </Text>
            </View>
            <View style={styles.pills}>
              <Text
                style={[
                  styles.statusPill,
                  restaurant.openNow ? styles.open : styles.closed,
                ]}
              >
                {restaurant.openNow ? "Open Now" : "Closed"}
              </Text>
              <Text style={styles.timePill}>{restaurant.timings}</Text>
            </View>
          </View>
        </View>

        <View style={styles.highlightRow}>
          <View style={styles.highlightCard}>
            <Feather name="star" size={17} color={colors.primary} />
            <Text style={styles.highlightValue}>{restaurant.rating.toFixed(1)}</Text>
            <Text style={styles.highlightLabel}>Rating</Text>
          </View>
          <View style={styles.highlightCard}>
            <Feather name="dollar-sign" size={17} color={colors.primary} />
            <Text style={styles.highlightValue}>{restaurant.priceCategory}</Text>
            <Text style={styles.highlightLabel}>Price</Text>
          </View>
          <View style={styles.highlightCard}>
            <Feather name="map-pin" size={17} color={colors.primary} />
            <Text style={styles.highlightValue} numberOfLines={1}>{restaurant.area}</Text>
            <Text style={styles.highlightLabel}>Area</Text>
          </View>
          <View style={styles.highlightCard}>
            <Feather name="book-open" size={17} color={colors.primary} />
            <Text style={styles.highlightValue}>{menu.length} Items</Text>
            <Text style={styles.highlightLabel}>Menu</Text>
          </View>
        </View>

        <View style={styles.aboutCard}>
          <Text style={styles.aboutTitle}>About {restaurant.name}</Text>
          <Text style={styles.aboutCopy}>{restaurant.description}</Text>
          <TouchableOpacity
            style={styles.websiteButton}
            onPress={() => void Linking.openURL(restaurant.website)}
          >
            <Feather name="globe" size={19} color={colors.primaryDark} />
            <Text style={styles.websiteText}>Visit Website</Text>
            <Feather
              name="external-link"
              size={18}
              color={colors.primaryDark}
            />
          </TouchableOpacity>
        </View>

        <View
          style={styles.stickyTabsContainer}
          onLayout={(event) => setMenuY(event.nativeEvent.layout.y)}
        >
          <View style={styles.menuHeader}>
            <Text style={styles.menuTitle}>Menu Highlights</Text>
            <View style={styles.menuLine} />
          </View>
          <CategoryTabs selected={category} onSelect={handleCategorySelect} />
        </View>

        <View style={styles.menuSectionContent}>
          {menu.length === 0 ? (
            <View style={styles.menuEmpty}>
              <View style={styles.emptyIconContainer}>
                <Feather name="book-open" size={32} color={colors.primary} />
              </View>
              <Text style={styles.menuEmptyTitle}>Menu Coming Soon</Text>
              <Text style={styles.menuEmptySub}>
                We are currently curating this menu to bring you the finest dining selection. Check back shortly!
              </Text>
            </View>
          ) : (
            <View style={styles.menuGroups}>
              {(["Starters", "Mains", "Desserts", "Beverages"] as const).map((catName) => {
                const items = menu.filter((item: MenuItem) => item.category === catName);
                if (items.length === 0) return null;
                return (
                  <View key={catName} style={styles.menuCategoryGroup}>
                    <Text style={styles.menuCategoryTitle}>{catName}</Text>
                    <View style={styles.menuGrid}>
                      {items.map((item: MenuItem) => (
                        <MenuCard key={item.id} item={item} />
                      ))}
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </View>

        <View style={styles.reviewSection}>
          <ReviewForm
            rating={reviewRating}
            title={reviewTitle}
            body={reviewBody}
            loading={isSubmittingReview}
            onRatingChange={setReviewRating}
            onTitleChange={setReviewTitle}
            onBodyChange={setReviewBody}
            onSubmit={handleSubmitReview}
          />
          <View style={styles.reviewHeader}>
            <Text style={styles.sectionTitle}>Guest Reviews</Text>
            <Text style={styles.sectionMeta}>
              {reviewsLoading
                ? "Loading…"
                : `${reviews.length} review${reviews.length === 1 ? "" : "s"}`}
            </Text>
          </View>
          {reviewsLoading ? (
            <Text style={styles.emptyText}>Loading reviews…</Text>
          ) : reviews.length === 0 ? (
            <Text style={styles.emptyText}>
              No reviews yet. Be the first to share your experience.
            </Text>
          ) : (
            reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))
          )}
        </View>

        <View style={styles.notice}>
          <Feather name="bell" size={28} color={colors.primaryDark} />
          <View>
            <Text style={styles.noticeTitle}>
              Prices are exclusive of taxes.
            </Text>
            <Text style={styles.noticeCopy}>We levy 10% service charge.</Text>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 32,
    paddingTop: 10,
  },
  topNav: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    marginBottom: 18,
    marginHorizontal: 14,
  },
  banner: {
    height: 280,
    overflow: "hidden",
    width: "100%",
  },
  bannerButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
    paddingTop: 16,
  },
  bannerText: {
    bottom: 20,
    left: 16,
    position: "absolute",
    right: 16,
  },
  restaurantName: {
    color: colors.white,
    fontFamily: "Georgia",
    fontSize: 32,
    lineHeight: 38,
    fontWeight: "700",
  },
  metaRow: {
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 7,
    marginTop: 6,
  },
  bannerMeta: {
    color: colors.white,
    fontSize: 13,
    fontWeight: "700",
    textShadowColor: "rgba(0,0,0,0.4)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  pills: {
    flexDirection: "row",
    gap: 10,
    marginTop: 12,
  },
  statusPill: {
    borderRadius: radius.pill,
    color: colors.white,
    fontSize: 12,
    fontWeight: "800",
    overflow: "hidden",
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  open: { backgroundColor: colors.success },
  closed: { backgroundColor: colors.danger },
  timePill: {
    backgroundColor: "rgba(255,255,255,0.22)",
    borderRadius: radius.pill,
    color: colors.white,
    fontSize: 12,
    fontWeight: "800",
    overflow: "hidden",
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  highlightRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 14,
    marginTop: 18,
    gap: 8,
  },
  highlightCard: {
    flex: 1,
    backgroundColor: colors.beigeSoft,
    borderRadius: radius.md,
    paddingVertical: 12,
    paddingHorizontal: 4,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    ...shadows.soft,
  },
  highlightValue: {
    color: colors.primaryDark,
    fontSize: 14,
    fontWeight: "800",
    textAlign: "center",
  },
  highlightLabel: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  aboutCard: {
    backgroundColor: colors.beigeSoft,
    borderRadius: radius.md,
    gap: 14,
    marginTop: 14,
    marginHorizontal: 14,
    padding: 18,
    ...shadows.soft,
  },
  aboutTitle: {
    color: colors.primaryDark,
    fontSize: 16,
    fontWeight: "800",
  },
  aboutCopy: {
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 23,
  },
  websiteButton: {
    alignItems: "center",
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: "row",
    gap: 10,
    justifyContent: "space-between",
    minHeight: 48,
    paddingHorizontal: 14,
  },
  websiteText: {
    color: colors.primaryDark,
    flex: 1,
    fontSize: 14,
    fontWeight: "800",
  },
  stickyTabsContainer: {
    backgroundColor: colors.background,
    paddingVertical: 12,
    paddingHorizontal: 14,
    zIndex: 10,
    marginTop: 18,
  },
  menuHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  menuTitle: {
    ...typography.h2,
    color: colors.primaryDark,
  },
  menuLine: {
    backgroundColor: colors.line,
    flex: 1,
    height: 1,
  },
  menuSectionContent: {
    marginHorizontal: 14,
    marginTop: 8,
  },
  menuGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 14,
  },
  menuGroups: {
    gap: 20,
  },
  menuCategoryGroup: {
    width: "100%",
  },
  menuCategoryTitle: {
    color: colors.primaryDark,
    fontFamily: "Georgia",
    fontSize: 20,
    fontWeight: "700",
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: 6,
  },
  reviewSection: {
    marginTop: 24,
    marginHorizontal: 14,
  },
  reviewHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginTop: 18,
    marginBottom: 12,
  },
  sectionTitle: {
    ...typography.h2,
    color: colors.primaryDark,
  },
  sectionMeta: {
    color: colors.textSecondary,
    fontSize: 13,
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
  notice: {
    alignItems: "center",
    backgroundColor: colors.beigeSoft,
    borderRadius: radius.md,
    flexDirection: "row",
    gap: 16,
    marginTop: 24,
    marginHorizontal: 14,
    padding: 16,
    ...shadows.soft,
  },
  noticeTitle: {
    color: colors.primaryDark,
    fontSize: 14,
    fontWeight: "800",
  },
  noticeCopy: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: 3,
  },
  menuEmpty: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 44,
    gap: 8,
    width: "100%",
    backgroundColor: colors.beigeSoft,
    borderRadius: radius.lg,
    ...shadows.soft,
    paddingHorizontal: 20,
  },
  emptyIconContainer: {
    backgroundColor: colors.beige,
    borderRadius: radius.pill,
    padding: 16,
    marginBottom: 4,
  },
  menuEmptyTitle: {
    color: colors.primaryDark,
    fontFamily: "Georgia",
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },
  menuEmptySub: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: "center",
    maxWidth: 260,
    lineHeight: 20,
    marginTop: 4,
  },
});
