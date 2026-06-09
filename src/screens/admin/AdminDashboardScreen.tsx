import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  FlatList,
} from "react-native";

import { Screen } from "@/components/common/Screen";
import { useAuthStore } from "@/store/authStore";
import { colors, radius, shadows } from "@/theme";
import { useRestaurants } from "@/hooks/useRestaurants";
import { useMenu } from "@/hooks/useMenu";
import {
  useAdminOffers,
  useAdminReviews,
  useAdminRestaurantMutations,
  useAdminMenuItemMutations,
  useAdminOfferMutations,
  useAdminReviewMutations,
} from "@/hooks/useAdmin";

type Tab = "restaurants" | "menu" | "offers" | "reviews";

export function AdminDashboardScreen() {
  const navigation = useNavigation<any>();
  const user = useAuthStore((state) => state.user);
  const [activeTab, setActiveTab] = useState<Tab>("restaurants");

  // State for adding/editing items
  const [editMode, setEditMode] = useState<"add" | "edit" | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Restaurant form fields
  const [restName, setRestName] = useState("");
  const [restArea, setRestArea] = useState("");
  const [restCity, setRestCity] = useState("");
  const [restCuisines, setRestCuisines] = useState("");
  const [restPriceLevel, setRestPriceLevel] = useState("2");
  const [restTimings, setRestTimings] = useState("11:00 AM - 11:00 PM");
  const [restWebsite, setRestWebsite] = useState("https://faattsoo.local");
  const [restDescription, setRestDescription] = useState("");

  // Menu Item form fields
  const [menuRestId, setMenuRestId] = useState("");
  const [menuName, setMenuName] = useState("");
  const [menuDesc, setMenuDesc] = useState("");
  const [menuPrice, setMenuPrice] = useState("");
  const [menuCat, setMenuCat] = useState("Mains");

  // Offer form fields
  const [offerRestId, setOfferRestId] = useState("");
  const [offerRestName, setOfferRestName] = useState("");
  const [offerTitle, setOfferTitle] = useState("");
  const [offerBadge, setOfferBadge] = useState("");
  const [offerLocation, setOfferLocation] = useState("");
  const [offerValidUntil, setOfferValidUntil] = useState("");
  const [offerImage, setOfferImage] = useState("");

  // Queries
  const { data: restaurants = [], isLoading: loadingRestaurants } = useRestaurants();
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string>("");
  const { data: menuItems = [], isLoading: loadingMenu } = useMenu(selectedRestaurantId || "invalid-id", "All");
  const { data: offers = [], isLoading: loadingOffers } = useAdminOffers();
  const { data: reviews = [], isLoading: loadingReviews } = useAdminReviews();

  // Mutations
  const restMutations = useAdminRestaurantMutations();
  const menuMutations = useAdminMenuItemMutations();
  const offerMutations = useAdminOfferMutations();
  const reviewMutations = useAdminReviewMutations();

  // Unauthorized check
  if (user?.role !== "admin") {
    return (
      <Screen>
        <View style={styles.unauthorized}>
          <Feather name="shield" size={64} color={colors.danger} />
          <Text style={styles.unauthorizedTitle}>Access Denied</Text>
          <Text style={styles.unauthorizedSubtitle}>
            Only administrators are allowed to access this panel.
          </Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </Screen>
    );
  }

  const handleRestaurantSubmit = async () => {
    if (!restName || !restArea || !restCity) {
      Alert.alert("Error", "Name, Area, and City are required fields.");
      return;
    }
    const cuisinesArray = restCuisines.split(",").map((c) => c.trim()).filter(Boolean);
    const data = {
      name: restName,
      area: restArea,
      city: restCity,
      cuisines: cuisinesArray,
      priceLevel: parseInt(restPriceLevel) || 2,
      timings: restTimings,
      website: restWebsite,
      description: restDescription,
    };

    try {
      if (editMode === "add") {
        await restMutations.addMutation.mutateAsync(data);
      } else if (editMode === "edit" && selectedId) {
        await restMutations.editMutation.mutateAsync({ id: selectedId, data });
      }
      resetForm();
      Alert.alert("Success", "Restaurant details saved successfully.");
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to save restaurant details.");
    }
  };

  const handleMenuItemSubmit = async () => {
    if (!menuRestId || !menuName || !menuPrice) {
      Alert.alert("Error", "Restaurant ID, Name, and Price are required.");
      return;
    }
    const data = {
      restaurant_id: menuRestId,
      name: menuName,
      description: menuDesc,
      price: parseFloat(menuPrice) || 0,
      category: menuCat,
    };

    try {
      if (editMode === "add") {
        await menuMutations.addMutation.mutateAsync(data);
      } else if (editMode === "edit" && selectedId) {
        await menuMutations.editMutation.mutateAsync({ id: selectedId, data });
      }
      resetForm();
      Alert.alert("Success", "Menu item saved successfully.");
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to save menu item.");
    }
  };

  const handleOfferSubmit = async () => {
    if (!offerRestId || !offerRestName || !offerTitle || !offerBadge || !offerLocation || !offerValidUntil || !offerImage) {
      Alert.alert("Error", "All fields are required for creating an offer.");
      return;
    }
    const data = {
      restaurantId: offerRestId,
      restaurantName: offerRestName,
      title: offerTitle,
      badge: offerBadge,
      location: offerLocation,
      validUntil: offerValidUntil,
      image: offerImage,
    };

    try {
      if (editMode === "add") {
        await offerMutations.addMutation.mutateAsync(data);
      } else if (editMode === "edit" && selectedId) {
        await offerMutations.editMutation.mutateAsync({ id: selectedId, data });
      }
      resetForm();
      Alert.alert("Success", "Offer saved successfully.");
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to save offer.");
    }
  };

  const resetForm = () => {
    setEditMode(null);
    setSelectedId(null);

    // Reset fields
    setRestName("");
    setRestArea("");
    setRestCity("");
    setRestCuisines("");
    setRestPriceLevel("2");
    setRestTimings("11:00 AM - 11:00 PM");
    setRestWebsite("https://faattsoo.local");
    setRestDescription("");

    setMenuName("");
    setMenuDesc("");
    setMenuPrice("");
    setMenuCat("Mains");

    setOfferRestId("");
    setOfferRestName("");
    setOfferTitle("");
    setOfferBadge("");
    setOfferLocation("");
    setOfferValidUntil("");
    setOfferImage("");
  };

  const handleEditRestaurant = (item: any) => {
    setEditMode("edit");
    setSelectedId(item.id);
    setRestName(item.name);
    setRestArea(item.area);
    setRestCity(item.city);
    setRestCuisines(item.cuisines?.join(", ") ?? "");
    setRestPriceLevel(String(item.priceLevel ?? 2));
    setRestTimings(item.timings ?? "");
    setRestWebsite(item.website ?? "");
    setRestDescription(item.description ?? "");
  };

  const handleEditMenuItem = (item: any) => {
    setEditMode("edit");
    setSelectedId(item.id);
    setMenuRestId(item.restaurantId);
    setMenuName(item.name);
    setMenuDesc(item.description);
    setMenuPrice(String(item.price));
    setMenuCat(item.category);
  };

  const handleEditOffer = (item: any) => {
    setEditMode("edit");
    setSelectedId(item._id || item.id);
    setOfferRestId(item.restaurantId);
    setOfferRestName(item.restaurantName);
    setOfferTitle(item.title);
    setOfferBadge(item.badge);
    setOfferLocation(item.location);
    setOfferValidUntil(item.validUntil);
    setOfferImage(item.image);
  };

  return (
    <Screen>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backIcon}>
          <Feather name="arrow-left" size={24} color={colors.primaryDark} />
        </TouchableOpacity>
        <Text style={styles.title}>Admin Panel</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {(["restaurants", "menu", "offers", "reviews"] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabButton, activeTab === tab && styles.activeTabButton]}
            onPress={() => {
              setActiveTab(tab);
              resetForm();
            }}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tab.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {editMode ? (
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>
              {editMode === "add" ? "Add New" : "Edit"} {activeTab === "menu" ? "Menu Item" : activeTab.slice(0, -1)}
            </Text>

            {activeTab === "restaurants" && (
              <>
                <TextInput placeholder="Name" value={restName} onChangeText={setRestName} style={styles.input} />
                <TextInput placeholder="Area" value={restArea} onChangeText={setRestArea} style={styles.input} />
                <TextInput placeholder="City" value={restCity} onChangeText={setRestCity} style={styles.input} />
                <TextInput placeholder="Cuisines (comma-separated)" value={restCuisines} onChangeText={setRestCuisines} style={styles.input} />
                <TextInput placeholder="Price Level (1-4)" value={restPriceLevel} onChangeText={setRestPriceLevel} keyboardType="numeric" style={styles.input} />
                <TextInput placeholder="Timings" value={restTimings} onChangeText={setRestTimings} style={styles.input} />
                <TextInput placeholder="Website" value={restWebsite} onChangeText={setRestWebsite} style={styles.input} />
                <TextInput placeholder="Description" value={restDescription} onChangeText={setRestDescription} multiline style={[styles.input, styles.textarea]} />
                <TouchableOpacity onPress={handleRestaurantSubmit} style={styles.submitButton}>
                  <Text style={styles.submitButtonText}>Save Restaurant</Text>
                </TouchableOpacity>
              </>
            )}

            {activeTab === "menu" && (
              <>
                <TextInput placeholder="Restaurant ID" value={menuRestId} onChangeText={setMenuRestId} style={styles.input} />
                <TextInput placeholder="Name" value={menuName} onChangeText={setMenuName} style={styles.input} />
                <TextInput placeholder="Price" value={menuPrice} onChangeText={setMenuPrice} keyboardType="numeric" style={styles.input} />
                <TextInput placeholder="Category (Starters/Mains/Desserts/Beverages)" value={menuCat} onChangeText={setMenuCat} style={styles.input} />
                <TextInput placeholder="Description" value={menuDesc} onChangeText={setMenuDesc} multiline style={[styles.input, styles.textarea]} />
                <TouchableOpacity onPress={handleMenuItemSubmit} style={styles.submitButton}>
                  <Text style={styles.submitButtonText}>Save Menu Item</Text>
                </TouchableOpacity>
              </>
            )}

            {activeTab === "offers" && (
              <>
                <TextInput placeholder="Restaurant ID" value={offerRestId} onChangeText={setOfferRestId} style={styles.input} />
                <TextInput placeholder="Restaurant Name" value={offerRestName} onChangeText={setOfferRestName} style={styles.input} />
                <TextInput placeholder="Offer Title" value={offerTitle} onChangeText={setOfferTitle} style={styles.input} />
                <TextInput placeholder="Offer Badge (e.g. 50% OFF)" value={offerBadge} onChangeText={setOfferBadge} style={styles.input} />
                <TextInput placeholder="Location/Applicability" value={offerLocation} onChangeText={setOfferLocation} style={styles.input} />
                <TextInput placeholder="Valid Until" value={offerValidUntil} onChangeText={setOfferValidUntil} style={styles.input} />
                <TextInput placeholder="Image (seed name)" value={offerImage} onChangeText={setOfferImage} style={styles.input} />
                <TouchableOpacity onPress={handleOfferSubmit} style={styles.submitButton}>
                  <Text style={styles.submitButtonText}>Save Offer</Text>
                </TouchableOpacity>
              </>
            )}

            <TouchableOpacity onPress={resetForm} style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            {/* List Screen Header */}
            {activeTab !== "reviews" && (
              <TouchableOpacity
                onPress={() => {
                  setEditMode("add");
                  if (activeTab === "menu" && selectedRestaurantId) {
                    setMenuRestId(selectedRestaurantId);
                  }
                }}
                style={styles.addButton}
              >
                <Feather name="plus" size={16} color={colors.white} />
                <Text style={styles.addButtonText}>Add New</Text>
              </TouchableOpacity>
            )}

            {/* TAB CONTENT: Restaurants */}
            {activeTab === "restaurants" && (
              <View>
                {loadingRestaurants ? (
                  <ActivityIndicator color={colors.primary} />
                ) : (
                  restaurants.map((item: any) => (
                    <View key={item.id} style={styles.rowCard}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.rowTitle}>{item.name}</Text>
                        <Text style={styles.rowSubtitle}>{item.area}, {item.city}</Text>
                        <Text style={styles.rowMeta}>ID: {item.id}</Text>
                      </View>
                      <View style={styles.rowActions}>
                        <TouchableOpacity onPress={() => handleEditRestaurant(item)} style={styles.actionBtn}>
                          <Feather name="edit-2" size={16} color={colors.primaryDark} />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => {
                            Alert.alert("Confirm Delete", `Are you sure you want to delete ${item.name}?`, [
                              { text: "Cancel", style: "cancel" },
                              {
                                text: "Delete",
                                style: "destructive",
                                onPress: () => restMutations.deleteMutation.mutate(item.id),
                              },
                            ]);
                          }}
                          style={styles.actionBtn}
                        >
                          <Feather name="trash-2" size={16} color={colors.danger} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))
                )}
              </View>
            )}

            {/* TAB CONTENT: Menu */}
            {activeTab === "menu" && (
              <View>
                <Text style={styles.sectionHeading}>Select Restaurant to load Menu Items:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.selectorScroll}>
                  {restaurants.map((r: any) => (
                    <TouchableOpacity
                      key={r.id}
                      onPress={() => setSelectedRestaurantId(r.id)}
                      style={[
                        styles.selectorPill,
                        selectedRestaurantId === r.id && styles.selectorPillActive,
                      ]}
                    >
                      <Text style={[styles.selectorPillText, selectedRestaurantId === r.id && styles.selectorPillTextActive]}>
                        {r.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                {selectedRestaurantId ? (
                  loadingMenu ? (
                    <ActivityIndicator color={colors.primary} />
                  ) : menuItems.length === 0 ? (
                    <Text style={styles.emptyText}>No menu items for this restaurant yet.</Text>
                  ) : (
                    menuItems.map((item: any) => (
                      <View key={item.id} style={styles.rowCard}>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.rowTitle}>{item.name}</Text>
                          <Text style={styles.rowSubtitle}>Category: {item.category} • Price: ₹{item.price}</Text>
                        </View>
                        <View style={styles.rowActions}>
                          <TouchableOpacity onPress={() => handleEditMenuItem(item)} style={styles.actionBtn}>
                            <Feather name="edit-2" size={16} color={colors.primaryDark} />
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => {
                              Alert.alert("Confirm Delete", `Are you sure you want to delete ${item.name}?`, [
                                { text: "Cancel", style: "cancel" },
                                {
                                  text: "Delete",
                                  style: "destructive",
                                  onPress: () => menuMutations.deleteMutation.mutate(item.id),
                                },
                              ]);
                            }}
                            style={styles.actionBtn}
                          >
                            <Feather name="trash-2" size={16} color={colors.danger} />
                          </TouchableOpacity>
                        </View>
                      </View>
                    ))
                  )
                ) : (
                  <Text style={styles.emptyText}>Please select a restaurant to manage menu items.</Text>
                )}
              </View>
            )}

            {/* TAB CONTENT: Offers */}
            {activeTab === "offers" && (
              <View>
                {loadingOffers ? (
                  <ActivityIndicator color={colors.primary} />
                ) : offers.length === 0 ? (
                  <Text style={styles.emptyText}>No offers found.</Text>
                ) : (
                  offers.map((item: any) => {
                    const id = item._id || item.id;
                    return (
                      <View key={id} style={styles.rowCard}>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.rowTitle}>{item.title}</Text>
                          <Text style={styles.rowSubtitle}>{item.restaurantName} ({item.badge})</Text>
                          <Text style={styles.rowMeta}>Valid: {item.validUntil}</Text>
                        </View>
                        <View style={styles.rowActions}>
                          <TouchableOpacity onPress={() => handleEditOffer(item)} style={styles.actionBtn}>
                            <Feather name="edit-2" size={16} color={colors.primaryDark} />
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => {
                              Alert.alert("Confirm Delete", `Are you sure you want to delete this offer?`, [
                                { text: "Cancel", style: "cancel" },
                                {
                                  text: "Delete",
                                  style: "destructive",
                                  onPress: () => offerMutations.deleteMutation.mutate(id),
                                },
                              ]);
                            }}
                            style={styles.actionBtn}
                          >
                            <Feather name="trash-2" size={16} color={colors.danger} />
                          </TouchableOpacity>
                        </View>
                      </View>
                    );
                  })
                )}
              </View>
            )}

            {/* TAB CONTENT: Reviews */}
            {activeTab === "reviews" && (
              <View>
                {loadingReviews ? (
                  <ActivityIndicator color={colors.primary} />
                ) : reviews.length === 0 ? (
                  <Text style={styles.emptyText}>No guest reviews found.</Text>
                ) : (
                  reviews.map((item: any) => {
                    const id = item._id || item.id;
                    return (
                      <View key={id} style={styles.rowCard}>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.rowTitle}>{item.userName} ({item.rating} ★)</Text>
                          <Text style={styles.rowSubtitle} numberOfLines={2}>{item.review || item.body}</Text>
                          {item.title && <Text style={styles.rowMeta}>Title: {item.title}</Text>}
                        </View>
                        <View style={styles.rowActions}>
                          <TouchableOpacity
                            onPress={() => {
                              Alert.alert("Confirm Delete", `Are you sure you want to delete this review?`, [
                                { text: "Cancel", style: "cancel" },
                                {
                                  text: "Delete",
                                  style: "destructive",
                                  onPress: () => reviewMutations.deleteMutation.mutate(id),
                                },
                              ]);
                            }}
                            style={styles.actionBtn}
                          >
                            <Feather name="trash-2" size={16} color={colors.danger} />
                          </TouchableOpacity>
                        </View>
                      </View>
                    );
                  })
                )}
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  unauthorized: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    gap: 12,
  },
  unauthorizedTitle: {
    fontFamily: "Georgia",
    fontSize: 22,
    fontWeight: "700",
    color: colors.danger,
    marginTop: 12,
  },
  unauthorizedSubtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: colors.primaryDark,
    borderRadius: radius.md,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  backButtonText: {
    color: colors.white,
    fontWeight: "800",
    fontSize: 14,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backIcon: {
    padding: 4,
    marginRight: 12,
  },
  title: {
    fontFamily: "Georgia",
    fontSize: 22,
    fontWeight: "700",
    color: colors.primaryDark,
  },
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: colors.beige,
    padding: 4,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: radius.sm,
  },
  activeTabButton: {
    backgroundColor: colors.primaryDark,
  },
  tabText: {
    fontSize: 11,
    fontWeight: "800",
    color: colors.primaryDark,
  },
  activeTabText: {
    color: colors.white,
  },
  container: {
    padding: 14,
    paddingBottom: 40,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.success,
    borderRadius: radius.md,
    paddingVertical: 12,
    marginBottom: 16,
    gap: 6,
    ...shadows.soft,
  },
  addButtonText: {
    color: colors.white,
    fontWeight: "800",
    fontSize: 14,
  },
  rowCard: {
    backgroundColor: colors.beigeSoft,
    borderRadius: radius.md,
    padding: 14,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    borderColor: colors.border,
    borderWidth: 1,
    ...shadows.soft,
  },
  rowTitle: {
    fontFamily: "Georgia",
    fontSize: 16,
    fontWeight: "700",
    color: colors.primaryDark,
  },
  rowSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  rowMeta: {
    fontSize: 11,
    color: colors.textSecondary,
    opacity: 0.8,
    marginTop: 2,
  },
  rowActions: {
    flexDirection: "row",
    gap: 8,
  },
  actionBtn: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.sm,
    padding: 8,
  },
  selectorScroll: {
    marginVertical: 10,
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.primaryDark,
    marginTop: 6,
  },
  selectorPill: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: radius.pill,
    backgroundColor: colors.beige,
    marginRight: 8,
    borderColor: colors.border,
    borderWidth: 1,
  },
  selectorPillActive: {
    backgroundColor: colors.primaryDark,
    borderColor: colors.primaryDark,
  },
  selectorPillText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.primaryDark,
  },
  selectorPillTextActive: {
    color: colors.white,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
    paddingVertical: 30,
  },
  formCard: {
    backgroundColor: colors.beigeSoft,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: 16,
    ...shadows.card,
  },
  formTitle: {
    fontFamily: "Georgia",
    fontSize: 18,
    fontWeight: "700",
    color: colors.primaryDark,
    marginBottom: 16,
  },
  input: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.sm,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 14,
    color: colors.text,
    marginBottom: 12,
  },
  textarea: {
    height: 80,
    textAlignVertical: "top",
  },
  submitButton: {
    backgroundColor: colors.primaryDark,
    borderRadius: radius.md,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 8,
  },
  submitButtonText: {
    color: colors.white,
    fontWeight: "800",
    fontSize: 14,
  },
  cancelButton: {
    backgroundColor: "transparent",
    borderRadius: radius.md,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 8,
    borderColor: colors.border,
    borderWidth: 1,
  },
  cancelButtonText: {
    color: colors.primaryDark,
    fontWeight: "700",
    fontSize: 14,
  },
});
