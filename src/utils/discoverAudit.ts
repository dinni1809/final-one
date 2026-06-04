import type { Restaurant } from "@/types/restaurant";
import { normalizeCuisineValues } from "@/utils/filterOptions";
import { getImageAuditReport } from "@/utils/restaurantImageAudit";

export type CardFieldIssue = {
  restaurantId: string;
  restaurantName: string;
  field: string;
  issue: string;
};

export function auditRestaurantCards(
  restaurants: Restaurant[],
): CardFieldIssue[] {
  const issues: CardFieldIssue[] = [];

  for (const r of restaurants) {
    if (!r.name?.trim()) {
      issues.push({
        restaurantId: r.id,
        restaurantName: r.name || "(unnamed)",
        field: "name",
        issue: "Missing or empty title",
      });
    }

    if (r.rating == null || Number.isNaN(r.rating)) {
      issues.push({
        restaurantId: r.id,
        restaurantName: r.name,
        field: "rating",
        issue: "Invalid rating value",
      });
    }

    const cuisines = normalizeCuisineValues(r.cuisines);
    if (cuisines.length === 0) {
      issues.push({
        restaurantId: r.id,
        restaurantName: r.name,
        field: "cuisine",
        issue: "No cuisine values after parsing",
      });
    } else if (
      r.cuisines.some((c) => c.includes(",")) ||
      cuisines.length > r.cuisines.length
    ) {
      issues.push({
        restaurantId: r.id,
        restaurantName: r.name,
        field: "cuisine",
        issue: `Comma-separated cuisine stored as combined value: ${JSON.stringify(r.cuisines)} → parsed: ${JSON.stringify(cuisines)}`,
      });
    }

    if (!r.area?.trim()) {
      issues.push({
        restaurantId: r.id,
        restaurantName: r.name,
        field: "area",
        issue: "Missing area",
      });
    } else if (r.area.includes(",")) {
      issues.push({
        restaurantId: r.id,
        restaurantName: r.name,
        field: "area",
        issue: `Comma-separated area in source data: "${r.area}"`,
      });
    }

    if (!r.priceLevel || r.priceLevel < 1) {
      issues.push({
        restaurantId: r.id,
        restaurantName: r.name,
        field: "price",
        issue: `Invalid price level: ${r.priceLevel}`,
      });
    }

    if (!r.image?.trim()) {
      issues.push({
        restaurantId: r.id,
        restaurantName: r.name,
        field: "image",
        issue: "No image URL after normalization",
      });
    }
  }

  return issues;
}

export function printDiscoverAuditReport(restaurants: Restaurant[]) {
  const cardIssues = auditRestaurantCards(restaurants);
  const imageReport = getImageAuditReport();

  const report = {
    restaurantCount: restaurants.length,
    cardFieldIssues: cardIssues,
    imageAudit: imageReport,
  };

  console.log("[DiscoverAudit] Report", JSON.stringify(report, null, 2));

  if (cardIssues.length > 0) {
    console.warn(
      `[DiscoverAudit] ${cardIssues.length} card field issue(s) detected`,
    );
  }

  if (imageReport.loadFailures.length > 0) {
    console.warn(
      `[DiscoverAudit] ${imageReport.loadFailures.length} image load failure(s)`,
      imageReport.failedUrls,
    );
  }

  return report;
}
