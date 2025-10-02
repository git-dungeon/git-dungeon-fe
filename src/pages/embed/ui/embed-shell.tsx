import { useEffect } from "react";
import type { InventoryItem } from "@/entities/inventory/model/types";
import type { CharacterStatSummary } from "@/features/character-summary/lib/build-character-overview";
import { DashboardEmbeddingBanner } from "@/widgets/dashboard-embedding/ui/dashboard-embedding-banner";
import { createSpriteFromName } from "@/shared/lib/sprite-utils";

const FALLBACK_STATS: CharacterStatSummary = {
  total: {
    hp: 320,
    maxHp: 320,
    atk: 84,
    def: 72,
    luck: 18,
    ap: 4,
  },
  base: {
    hp: 260,
    maxHp: 260,
    atk: 64,
    def: 54,
    luck: 12,
    ap: 3,
  },
  equipmentBonus: {
    hp: 60,
    maxHp: 60,
    atk: 20,
    def: 18,
    luck: 6,
    ap: 1,
  },
};

const FALLBACK_EQUIPMENT: InventoryItem[] = [
  {
    id: "equip-helmet",
    name: "Aegis Helm",
    slot: "helmet",
    rarity: "epic",
    modifiers: [
      { stat: "hp", value: 25 },
      { stat: "def", value: 8 },
    ],
    sprite: createSpriteFromName("Aegis Helm"),
    createdAt: new Date("2025-01-12T09:00:00Z").toISOString(),
    isEquipped: true,
  },
  {
    id: "equip-armor",
    name: "Dragon Scale Armor",
    slot: "armor",
    rarity: "legendary",
    modifiers: [
      { stat: "hp", value: 35 },
      { stat: "def", value: 10 },
    ],
    sprite: createSpriteFromName("Dragon Scale Armor"),
    createdAt: new Date("2025-02-03T15:30:00Z").toISOString(),
    isEquipped: true,
  },
  {
    id: "equip-weapon",
    name: "Starlit Blade",
    slot: "weapon",
    rarity: "rare",
    modifiers: [
      { stat: "atk", value: 18 },
      { stat: "luck", value: 4 },
    ],
    sprite: createSpriteFromName("Starlit Blade"),
    createdAt: new Date("2025-02-18T21:45:00Z").toISOString(),
    isEquipped: true,
  },
  {
    id: "equip-ring",
    name: "Echoing Loop",
    slot: "ring",
    rarity: "uncommon",
    modifiers: [
      { stat: "luck", value: 2 },
      { stat: "ap", value: 1 },
    ],
    sprite: createSpriteFromName("Echoing Loop"),
    createdAt: new Date("2025-02-28T06:15:00Z").toISOString(),
    isEquipped: true,
  },
];

export function EmbedShell() {
  useEffect(() => {
    document.title = "Git Dungeon Embed";

    const robotsMeta = document.querySelector<HTMLMetaElement>(
      'meta[name="robots"]'
    );

    if (robotsMeta) {
      robotsMeta.content = "noindex, nofollow";
      return;
    }

    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
  }, []);

  return (
    <div className="flex w-full justify-center bg-transparent px-4 py-6">
      <DashboardEmbeddingBanner
        level={27}
        exp={1840}
        expToLevel={2500}
        gold={7260}
        ap={4}
        floor={{ current: 27, best: 32, progress: 0.58 }}
        stats={FALLBACK_STATS}
        equipment={FALLBACK_EQUIPMENT}
        layoutClassName="max-w-3xl"
      />
    </div>
  );
}
