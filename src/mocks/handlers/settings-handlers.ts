import { http } from "msw";
import { SETTINGS_ENDPOINTS } from "@/shared/config/env";
import { mockDashboardResponse } from "@/mocks/handlers/dashboard-handlers";
import { mockTimestampMinutesAgo } from "@/mocks/handlers/shared/time";
import {
  EMBED_PREVIEW_SIZE_VALUES,
  type EmbedPreviewSize,
} from "@/entities/embed/model/types";
import { respondWithSuccess } from "@/mocks/lib/api-response";

const DEFAULT_USER_ID = "user-123";

const mockProfileOverview = {
  profile: {
    userId: DEFAULT_USER_ID,
    username: "mock-user",
    displayName: "Mocked Adventurer",
    email: "mocked.adventurer@example.com",
    avatarUrl: "https://avatars.githubusercontent.com/u/1?v=4",
    joinedAt: "2023-11-02T12:00:00.000Z",
  },
  connections: {
    github: {
      connected: true,
      lastSyncAt: mockTimestampMinutesAgo(45),
    },
  },
};

const EMBEDDING_SIZE_FALLBACK: EmbedPreviewSize = "compact";
const EMBEDDING_SIZES = new Set<EmbedPreviewSize>(EMBED_PREVIEW_SIZE_VALUES);

function resolveEmbeddingSize(rawSize?: string | null): EmbedPreviewSize {
  if (!rawSize) {
    return EMBEDDING_SIZE_FALLBACK;
  }

  if (EMBEDDING_SIZES.has(rawSize as EmbedPreviewSize)) {
    return rawSize as EmbedPreviewSize;
  }

  return EMBEDDING_SIZE_FALLBACK;
}

function createMockEquipmentPreview() {
  const { state } = mockDashboardResponse;

  const equipment = [
    state.equippedWeapon,
    state.equippedHelmet,
    state.equippedArmor,
    state.equippedRing,
  ].filter(Boolean);

  return equipment.map((item) => {
    const safeItem = item!;
    return {
      id: safeItem.id,
      name: safeItem.name,
      slot: safeItem.slot,
      rarity: safeItem.rarity,
      modifiers: safeItem.modifiers,
      effect: safeItem.effect ?? null,
      sprite: buildSpriteFromName(safeItem.name),
    };
  });
}

function buildSpriteFromName(name: string): string {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><rect width='64' height='64' rx='10' fill='#1f2937'/><text x='50%' y='52%' font-size='26' text-anchor='middle' fill='white' font-family='Inter, Arial, sans-serif' font-weight='700'>${initials}</text></svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function createMockEmbeddingPreview(size: EmbedPreviewSize) {
  const { state } = mockDashboardResponse;
  const equipment = createMockEquipmentPreview();

  return {
    userId: DEFAULT_USER_ID,
    size,
    level: state.level,
    exp: state.exp,
    expToLevel: state.expToLevel,
    gold: state.gold,
    bestFloor: state.maxFloor,
    currentFloor: state.floor,
    floorProgress: state.floorProgress,
    stats: {
      hp: {
        current: state.hp,
        max: state.maxHp,
        equipmentBonus: undefined,
      },
      atk: {
        total: state.atk,
      },
      def: {
        total: state.def,
      },
      luck: {
        total: state.luck,
      },
      ap: {
        total: state.ap,
      },
    },
    equipment,
    generatedAt: new Date().toISOString(),
  };
}

export const settingsHandlers = [
  http.get(SETTINGS_ENDPOINTS.profile, () => {
    return respondWithSuccess(mockProfileOverview);
  }),
  http.get(SETTINGS_ENDPOINTS.preview, ({ request }) => {
    const url = new URL(request.url);
    const sizeParam = url.searchParams.get("size");
    const size = resolveEmbeddingSize(sizeParam);

    return respondWithSuccess({
      preview: createMockEmbeddingPreview(size),
    });
  }),
];
