import { getImageUri } from "@/utils/format";

export const RESTAURANT_IMAGE_FALLBACK = getImageUri(
  "photo-1517248135467-4c7edcad34c4",
);

export type ApiImageLog = {
  restaurantId: string;
  restaurantName: string;
  banner_image_url?: string | null;
  bannerImageUrl?: string | null;
  image_url?: string | null;
  image?: string | null;
  resolvedUrl: string;
  loggedAt: string;
};

export type ImageLoadFailure = {
  restaurantId: string;
  restaurantName: string;
  url: string;
  reason: string;
  loggedAt: string;
};

const apiImageLogs: ApiImageLog[] = [];
const loadFailures: ImageLoadFailure[] = [];

export function logApiImageUrl(entry: {
  restaurantId: string;
  restaurantName: string;
  banner_image_url?: string | null;
  bannerImageUrl?: string | null;
  image_url?: string | null;
  image?: string | null;
  resolvedUrl: string;
}) {
  const record: ApiImageLog = {
    ...entry,
    loggedAt: new Date().toISOString(),
  };
  apiImageLogs.push(record);
  console.log("[ImageAudit] API image_url", {
    restaurantId: record.restaurantId,
    restaurantName: record.restaurantName,
    banner_image_url: record.banner_image_url ?? null,
    bannerImageUrl: record.bannerImageUrl ?? null,
    image_url: record.image_url ?? null,
    image: record.image ?? null,
    resolvedUrl: record.resolvedUrl,
  });
}

export function recordImageLoadFailure(failure: Omit<ImageLoadFailure, "loggedAt">) {
  const existing = loadFailures.find(
    (f) => f.restaurantId === failure.restaurantId && f.url === failure.url,
  );
  if (existing) return;

  const record: ImageLoadFailure = {
    ...failure,
    loggedAt: new Date().toISOString(),
  };
  loadFailures.push(record);
  console.warn("[ImageAudit] Image load failed", {
    restaurantId: record.restaurantId,
    restaurantName: record.restaurantName,
    url: record.url,
    reason: record.reason,
  });
}

export function getImageAuditReport() {
  const missingFromApi = apiImageLogs.filter(
    (log) =>
      !log.banner_image_url?.trim() &&
      !log.bannerImageUrl?.trim() &&
      !log.image_url?.trim() &&
      !log.image?.trim(),
  );

  return {
    apiImageLogs: [...apiImageLogs],
    loadFailures: [...loadFailures],
    summary: {
      totalLoggedFromApi: apiImageLogs.length,
      missingImageFields: missingFromApi.length,
      failedLoads: loadFailures.length,
    },
    missingFromApi,
    failedUrls: loadFailures.map((f) => ({
      url: f.url,
      reason: f.reason,
      restaurantId: f.restaurantId,
      restaurantName: f.restaurantName,
    })),
  };
}

export function printImageAuditReport() {
  const report = getImageAuditReport();
  console.log("[ImageAudit] Report", JSON.stringify(report, null, 2));
  return report;
}

export function resolveRestaurantImageUrl(item: {
  banner_image_url?: string | null;
  bannerImageUrl?: string | null;
  image_url?: string | null;
  image?: string | null;
}): string {
  const raw =
    item.banner_image_url?.trim() ||
    item.bannerImageUrl?.trim() ||
    item.image_url?.trim() ||
    item.image?.trim();
  return raw || RESTAURANT_IMAGE_FALLBACK;
}
