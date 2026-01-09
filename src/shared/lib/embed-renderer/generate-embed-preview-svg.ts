import type { CharacterOverview as AppCharacterOverview } from "@/features/character-summary/lib/build-character-overview";
import type {
  EmbedPreviewLanguage,
  EmbedPreviewSize,
  EmbedPreviewTheme,
} from "@/entities/embed/model/types";
import {
  renderEmbedSvg,
  type CharacterOverview as RendererCharacterOverview,
  type InventoryItem as RendererInventoryItem,
  type EmbedFontConfig,
} from "@git-dungeon/embed-renderer";
import {
  loadFontsFromUrls,
  type BrowserFontSource,
} from "@git-dungeon/embed-renderer/browser";
import NotoSansKrFontUrl from "@/shared/assets/fonts/NotoSansKR-Regular.otf?url";
import { createSpriteFromLabel } from "@/shared/lib/sprite-utils";
import { formatInventoryEffect } from "@/entities/inventory/lib/formatters";

interface GenerateEmbedPreviewSvgParams {
  theme: EmbedPreviewTheme;
  size: EmbedPreviewSize;
  language: EmbedPreviewLanguage;
  overview: AppCharacterOverview;
  displayName?: string | null;
  avatarUrl?: string | null;
  maxAp?: number | null;
}

const DUNG_GEUN_MO_THIN_URL = "/ThinDungGeunMo.ttf";
const DUNG_GEUN_MO_BOLD_URL = "/BoldDunggeunmo.ttf";

const browserFontSources: BrowserFontSource[] = [
  {
    name: "DungGeunMo Thin",
    url: DUNG_GEUN_MO_THIN_URL,
    weight: 400,
    style: "normal",
  },
  {
    name: "DungGeunMo Bold",
    url: DUNG_GEUN_MO_BOLD_URL,
    weight: 700,
    style: "normal",
  },
  {
    name: "Noto Sans KR",
    url: NotoSansKrFontUrl,
    weight: 400,
    style: "normal",
  },
];

let cachedFonts: EmbedFontConfig[] | null = null;
let pendingFonts: Promise<EmbedFontConfig[]> | null = null;

const RARITY_COLOR_MAP: Record<string, string> = {
  common: "#6b7280",
  uncommon: "#22c55e",
  rare: "#3b82f6",
  epic: "#a855f7",
  legendary: "#facc15",
};

function resolveItemSprite(item: AppCharacterOverview["equipment"][number]) {
  if (isValidSpriteUrl(item.sprite)) {
    return item.sprite;
  }

  const rawDisplayName = item.name ?? item.code;
  const displayName = typeof rawDisplayName === "string" ? rawDisplayName : "";
  const label = displayName.trim().slice(0, 2).toUpperCase() || "??";
  const color = RARITY_COLOR_MAP[item.rarity] ?? "#6b7280";

  return createSpriteFromLabel(label, color);
}

function isValidSpriteUrl(sprite?: string | null) {
  if (!sprite) {
    return false;
  }
  return (
    sprite.startsWith("data:") ||
    sprite.startsWith("http://") ||
    sprite.startsWith("https://") ||
    sprite.startsWith("/")
  );
}

function toRendererInventoryItem(
  item: AppCharacterOverview["equipment"][number]
): RendererInventoryItem {
  if (item.slot === "consumable") {
    throw new Error("임베드 렌더링은 consumable 슬롯을 지원하지 않습니다.");
  }

  const rawDisplayName = item.name ?? item.code;
  const displayName =
    typeof rawDisplayName === "string" && rawDisplayName.trim()
      ? rawDisplayName
      : "Unknown";
  const sprite = resolveItemSprite(item);
  const code =
    typeof item.code === "string" && item.code.trim() ? item.code : null;

  return {
    id: item.id,
    ...(code ? { code } : {}),
    name: displayName,
    slot: item.slot,
    rarity: item.rarity,
    modifiers: item.modifiers.flatMap((modifier) => {
      if (modifier.kind !== "stat") {
        return [];
      }
      if (modifier.mode !== "flat") {
        return [];
      }
      return [{ stat: modifier.stat, value: modifier.value }];
    }),
    effect: item.effect
      ? {
          type: item.effect,
          description: formatInventoryEffect(item.effect),
        }
      : undefined,
    sprite,
    createdAt: item.createdAt,
    isEquipped: item.isEquipped,
  };
}

function toRendererOverview(
  overview: AppCharacterOverview,
  displayName?: string | null,
  avatarUrl?: string | null,
  maxAp?: number | null
): RendererCharacterOverview {
  return {
    ...overview,
    displayName: displayName ?? undefined,
    avatarUrl: avatarUrl ?? undefined,
    maxAp: maxAp ?? undefined,
    equipment: overview.equipment
      .filter((item) => item.slot !== "consumable")
      .map(toRendererInventoryItem),
  };
}

async function ensureFonts(): Promise<EmbedFontConfig[]> {
  if (cachedFonts) {
    return cachedFonts;
  }

  if (!pendingFonts) {
    pendingFonts = loadFontsFromUrls(browserFontSources)
      .then((fonts: EmbedFontConfig[]) => {
        cachedFonts = fonts;
        return fonts;
      })
      .finally(() => {
        pendingFonts = null;
      });
  }

  return pendingFonts!;
}

export async function generateEmbedPreviewSvg({
  theme,
  size,
  language,
  overview,
  displayName,
  avatarUrl,
  maxAp,
}: GenerateEmbedPreviewSvgParams) {
  try {
    const fonts = await ensureFonts();
    const rendererOverview = toRendererOverview(
      overview,
      displayName,
      avatarUrl,
      maxAp
    );
    return await renderEmbedSvg({
      theme,
      size,
      language,
      overview: rendererOverview,
      fonts,
    });
  } catch (error) {
    if (import.meta.env?.DEV) {
      console.error("[embed-preview] Satori 렌더링 에러", error);
    }
    const message =
      error instanceof Error
        ? `Satori 렌더링 실패: ${error.message}`
        : "Satori 렌더링 중 알 수 없는 오류가 발생했습니다.";

    throw error instanceof Error
      ? Object.assign(error, { message })
      : new Error(message);
  }
}
