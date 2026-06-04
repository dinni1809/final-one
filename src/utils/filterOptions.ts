/**
 * Splits comma-separated filter values from API/DB into individual options.
 * Trims whitespace, deduplicates (case-insensitive), preserves first-seen casing.
 */
export function splitCommaSeparatedValues(values: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const raw of values) {
    if (!raw?.trim()) continue;
    for (const part of raw.split(",")) {
      const trimmed = part.trim();
      if (!trimmed) continue;
      const key = trimmed.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      result.push(trimmed);
    }
  }

  return result.sort((a, b) => a.localeCompare(b));
}

export function normalizeValue(
  val: string,
  type: "area" | "cuisine" | "style" | "menuItem",
): string {
  let clean = val.trim();

  // Remove leading punctuation/dots and leading "and" (case-insensitive)
  clean = clean.replace(/^[.,\s]+/, "");
  clean = clean.replace(/^and\s+/i, "");
  clean = clean.replace(/[.,\s]+$/, "");
  clean = clean.trim();

  if (!clean) return "";

  const lower = clean.toLowerCase();

  if (type === "area") {
    if (lower === "indirangar") return "Indiranagar";
    if (lower === "koramnagala") return "Koramangala";
    if (lower === "whitefiled") return "Whitefield";
    if (lower === "jakku") return "Jakkur";
    if (lower === "fraser town") return "Frazer Town";
    if (lower === "electronic city phase 1") return "Electronic City";
    if (lower === "orion mall (rajajinagar)" || lower === "orion mall")
      return "Rajajinagar";
    if (
      lower === "phoenix marketcity (whitefield)" ||
      lower === "phoenix marketcity"
    )
      return "Whitefield";
    if (lower === "phoenix mall of asia (hebbal)") return "Hebbal";
    if (lower === "mantri square") return "Malleshwaram";
    if (lower === "central street") return "MG Road";
  } else if (type === "cuisine") {
    if (lower === "andhra style" || lower === "andhra") return "Andhra";
    if (lower === "dessert" || lower === "desserts") return "Desserts";
  } else if (type === "style") {
    if (lower === "cafe" || lower === "café") return "Cafe";
  }

  // Capitalize first letter of each word (Title Case) as default normalization
  return clean
    .split(/\s+/)
    .map((word) => {
      if (!word) return "";
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
}

export function splitAndNormalizeValues(
  values: string[],
  type: "area" | "cuisine" | "style" | "menuItem",
): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const raw of values) {
    if (!raw?.trim()) continue;
    for (const part of raw.split(",")) {
      const normalized = normalizeValue(part, type);
      if (!normalized) continue;
      const key = normalized.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      result.push(normalized);
    }
  }

  return result.sort((a, b) => a.localeCompare(b));
}

export function normalizeAreaValue(area?: string): string {
  if (!area?.trim()) return "Bangalore";
  const parts = splitAndNormalizeValues([area], "area");
  return parts.join(", ");
}

export function normalizeCuisineValues(
  cuisine?: string | string[],
): string[] {
  if (!cuisine) return [];
  const raw = Array.isArray(cuisine) ? cuisine : [cuisine];
  return splitAndNormalizeValues(raw, "cuisine");
}

export function restaurantMatchesArea(
  restaurantArea: string,
  selectedArea?: string,
): boolean {
  if (!selectedArea) return true;
  const parts = splitAndNormalizeValues([restaurantArea], "area");
  return parts.some(
    (part) => part.toLowerCase() === selectedArea.toLowerCase(),
  );
}

export function restaurantMatchesCuisine(
  cuisines: string[],
  selectedCuisine?: string,
): boolean {
  if (!selectedCuisine) return true;
  const normalized = normalizeCuisineValues(cuisines);
  return normalized.some(
    (c) => c.toLowerCase() === selectedCuisine.toLowerCase(),
  );
}
