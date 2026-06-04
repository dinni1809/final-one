import { Feather } from "@expo/vector-icons";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { colors, radius, shadows } from "@/theme";

type Props = {
  label: string;
  value?: string;
  placeholder: string;
  options: string[];
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  onSelect: (value?: string) => void;
};

const popularAreas = [
  "Koramangala",
  "Indiranagar",
  "Whitefield",
  "HSR Layout",
  "Hebbal",
  "Jayanagar",
  "Marathahalli",
  "Yelahanka",
];

const popularCuisines = [
  "Biryani",
  "South Indian",
  "North Indian",
  "Andhra",
  "Chinese",
  "Italian",
  "Fast Food",
  "Desserts",
  "Cafe",
  "Bakery",
];

const popularMenuItems = [
  "Biryani",
  "Pizza",
  "Burger",
  "Pasta",
  "Desserts",
  "Coffee",
  "Chicken",
  "Meals",
  "Sandwich",
  "Thali",
];

export function FilterDropdown({
  label,
  value,
  placeholder,
  options,
  open,
  onOpen,
  onClose,
  onSelect,
}: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [expanded, setExpanded] = useState(false);

  // Animation values
  const dropdownOpacity = useRef(new Animated.Value(0)).current;
  const dropdownTranslateY = useRef(new Animated.Value(-12)).current;

  useEffect(() => {
    if (!open) {
      setExpanded(false);
      setSearchQuery("");
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      Animated.parallel([
        Animated.timing(dropdownOpacity, {
          toValue: 1,
          duration: 200,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(dropdownTranslateY, {
          toValue: 0,
          duration: 200,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(dropdownOpacity, {
          toValue: 0,
          duration: 150,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(dropdownTranslateY, {
          toValue: -12,
          duration: 150,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [open, dropdownOpacity, dropdownTranslateY]);

  const handleSelect = (selected?: string) => {
    onSelect(selected);
  };

  const sortedOptions = useMemo(() => {
    let popularList: string[] = [];
    if (label === "Area") popularList = popularAreas;
    else if (label === "Cuisine") popularList = popularCuisines;
    else if (label === "Menu item") popularList = popularMenuItems;

    if (popularList.length === 0) {
      return options;
    }

    const popularSet = new Set(popularList.map((a) => a.toLowerCase()));
    
    // Extract popular options that exist in options
    const popularInOptions = options.filter((o) =>
      popularSet.has(o.toLowerCase())
    );
    
    // Sort them by their index in the popularList
    popularInOptions.sort((a, b) => {
      const idxA = popularList.findIndex(
        (pa) => pa.toLowerCase() === a.toLowerCase()
      );
      const idxB = popularList.findIndex(
        (pa) => pa.toLowerCase() === b.toLowerCase()
      );
      return idxA - idxB;
    });

    // Extract the remaining options
    const remaining = options.filter(
      (o) => !popularSet.has(o.toLowerCase())
    );

    // Remaining are already sorted alphabetically since 'options' is sorted
    return [...popularInOptions, ...remaining];
  }, [options, label]);

  const filteredOptions = useMemo(() => {
    if (!searchQuery.trim()) return sortedOptions;
    const q = searchQuery.toLowerCase().trim();
    return sortedOptions.filter((opt) => opt.toLowerCase().includes(q));
  }, [sortedOptions, searchQuery]);

  const limit = useMemo(() => {
    if (label === "Area") return 8;
    if (label === "Cuisine") return 10;
    if (label === "Menu item") return 10;
    return 12; // Type/Style
  }, [label]);

  const visibleOptions = useMemo(() => {
    if (searchQuery.trim()) {
      return filteredOptions;
    }
    return expanded ? filteredOptions : filteredOptions.slice(0, limit);
  }, [filteredOptions, searchQuery, expanded, limit]);

  return (
    <View style={[styles.wrap, { zIndex: open ? 9999 : 1 }]}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        activeOpacity={0.78}
        onPress={onOpen}
        style={[styles.control, open && styles.controlActive]}
      >
        <Text
          style={[styles.value, !value && styles.placeholder]}
          numberOfLines={1}
        >
          {value ?? placeholder}
        </Text>
        <Feather
          name={open ? "chevron-up" : "chevron-down"}
          size={19}
          color={colors.primaryDark}
        />
      </TouchableOpacity>

      {open && (
        <Pressable
          onPress={() => {}}
          style={{
            position: "absolute",
            top: 78,
            left: 0,
            right: 0,
            zIndex: 9999,
          }}
        >
          <Animated.View
            style={[
              styles.dropdown,
              {
                opacity: dropdownOpacity,
                transform: [{ translateY: dropdownTranslateY }],
              },
              { position: "relative", top: 0 },
            ]}
          >
          {/* Search Box */}
          <View style={styles.searchContainer}>
            <Feather
              name="search"
              size={16}
              color={colors.textSecondary}
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder={`Search ${label.toLowerCase()}...`}
              placeholderTextColor={colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCorrect={false}
              autoCapitalize="none"
            />
            {searchQuery ? (
              <TouchableOpacity
                onPress={() => setSearchQuery("")}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Feather name="x" size={16} color={colors.textSecondary} />
              </TouchableOpacity>
            ) : null}
          </View>

          {/* List of Options */}
          <ScrollView
            style={styles.dropdownScroll}
            contentContainerStyle={styles.dropdownScrollContent}
            nestedScrollEnabled={true}
            keyboardShouldPersistTaps="handled"
            bounces={false}
          >
            {filteredOptions.length === 0 ? (
              <Text style={styles.noResults}>No results found</Text>
            ) : (
              <>
                {/* All Option */}
                <TouchableOpacity
                  style={[styles.optionItem, !value && styles.optionItemSelected]}
                  activeOpacity={0.7}
                  onPress={() => handleSelect(undefined)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      !value && styles.optionTextSelected,
                    ]}
                  >
                    All {label.toLowerCase()}
                  </Text>
                  {!value && (
                    <Feather name="check" size={16} color="#8B4E12" />
                  )}
                </TouchableOpacity>

                {/* Visible Options */}
                {visibleOptions.map((item) => {
                  const active = item === value;
                  return (
                    <TouchableOpacity
                      key={item}
                      style={[
                        styles.optionItem,
                        active && styles.optionItemSelected,
                      ]}
                      activeOpacity={0.7}
                      onPress={() => handleSelect(item)}
                    >
                      <Text
                        style={[
                          styles.optionText,
                          active && styles.optionTextSelected,
                        ]}
                      >
                        {item}
                      </Text>
                      {active && (
                        <Feather name="check" size={16} color="#8B4E12" />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </>
            )}
          </ScrollView>

          {/* Show More / Show Less Button */}
          {filteredOptions.length > limit &&
            !searchQuery.trim() && (
              <TouchableOpacity
                style={styles.showMoreInline}
                activeOpacity={0.7}
                onPress={() => setExpanded(!expanded)}
              >
                <Text style={styles.showMoreText}>
                  {expanded
                    ? "Show Less"
                    : `Show More (${
                        filteredOptions.length - limit
                      } more)`}
                </Text>
                <Feather
                  name={expanded ? "chevron-up" : "chevron-down"}
                  size={14}
                  color={colors.primaryDark}
                  style={{ marginLeft: 4 }}
                />
              </TouchableOpacity>
            )}
          </Animated.View>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 16,
    width: "100%",
    position: "relative",
  },
  label: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  control: {
    alignItems: "center",
    backgroundColor: colors.beigeSoft,
    borderColor: colors.border,
    borderRadius: radius.xl,
    borderWidth: 1,
    flexDirection: "row",
    gap: 10,
    minHeight: 54,
    paddingHorizontal: 16,
    ...shadows.soft,
  },
  controlActive: {
    borderColor: "#D6A36E",
    backgroundColor: "#FAF6EE",
  },
  value: {
    color: colors.primaryDark,
    flex: 1,
    fontSize: 15,
    fontWeight: "800",
  },
  placeholder: {
    color: colors.textSecondary,
    fontWeight: "700",
  },
  dropdown: {
    position: "absolute",
    top: 78,
    left: 0,
    right: 0,
    backgroundColor: "#FAF6EE",
    borderColor: "#D6A36E",
    borderRadius: radius.xl,
    borderWidth: 1,
    maxHeight: 250,
    ...shadows.card,
    zIndex: 9999,
    elevation: 20,
    overflow: "hidden",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#EADDC9",
    borderWidth: 1,
    borderRadius: radius.lg,
    margin: 8,
    paddingHorizontal: 10,
    height: 40,
  },
  searchIcon: {
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    color: "#4A2C1A",
    fontSize: 14,
    fontWeight: "600",
    padding: 0,
  },
  dropdownScroll: {
    flexGrow: 0,
  },
  dropdownScrollContent: {
    paddingVertical: 4,
  },
  optionItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  optionItemSelected: {
    backgroundColor: "#EADDC9",
  },
  optionText: {
    color: "#4A2C1A",
    fontSize: 14,
    fontWeight: "700",
  },
  optionTextSelected: {
    color: "#8B4E12",
    fontWeight: "800",
  },
  noResults: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: "center",
    paddingVertical: 16,
    fontWeight: "600",
  },
  showMoreInline: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderTopColor: "#EADDC9",
    borderTopWidth: 1,
    paddingVertical: 10,
    backgroundColor: "#EADDC9",
  },
  showMoreText: {
    color: colors.primaryDark,
    fontSize: 13,
    fontWeight: "800",
  },
});
