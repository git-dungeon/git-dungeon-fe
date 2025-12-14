import battleImage from "@/assets/battle.png";
import restImage from "@/assets/rest.png";
import trapImage from "@/assets/trap.png";
import treasureImage from "@/assets/treasure.png";
import moveImage from "@/assets/move.png";
import goldImage from "@/assets/gold.png";
import leatherCapImage from "@/assets/Leather Cap.png";
import leatherArmorImage from "@/assets/Leather Armor.png";
import woodenSwordImage from "@/assets/Wooden Sword.png";
import copperBandImage from "@/assets/Copper Band.png";
import giantRatImage from "@/assets/Giant Rat.png";

import type {
  DungeonLogEntry,
  DungeonLogAction,
} from "@/entities/dungeon-log/model/types";

export type LogThumbnailBadge = "gain" | "loss";

export interface LogThumbnailDescriptor {
  id: string;
  src: string;
  alt: string;
  badge?: LogThumbnailBadge;
}

const ACTION_IMAGE_MAP: Partial<Record<DungeonLogAction, string>> = {
  BATTLE: battleImage,
  TREASURE: treasureImage,
  REST: restImage,
  TRAP: trapImage,
  MOVE: moveImage,
};

const SLOT_FALLBACK_IMAGE: Record<string, string> = {
  helmet: leatherCapImage,
  armor: leatherArmorImage,
  weapon: woodenSwordImage,
  ring: copperBandImage,
};

const ITEM_IMAGE_MAP: Record<string, string> = {
  "Leather Cap": leatherCapImage,
  "Leather Armor": leatherArmorImage,
  "Wooden Sword": woodenSwordImage,
  "Copper Ring": copperBandImage,
  "Copper Band": copperBandImage,
};

const BADGE_PRESENTATIONS: Record<
  LogThumbnailBadge,
  { label: string; className: string }
> = {
  gain: { label: "+", className: "bg-emerald-500" },
  loss: { label: "-", className: "bg-rose-500" },
};

export function resolveThumbnailBadgePresentation(badge?: LogThumbnailBadge) {
  if (!badge) {
    return undefined;
  }
  return BADGE_PRESENTATIONS[badge];
}

export function resolveActionThumbnail(action: DungeonLogAction) {
  return ACTION_IMAGE_MAP[action];
}

const MONSTER_SPRITE_MAP: Record<string, string> = {
  monster_giant_rat: giantRatImage,
};

function resolveMonsterThumbnail(spriteId?: string) {
  if (!spriteId) {
    return undefined;
  }
  return MONSTER_SPRITE_MAP[spriteId];
}

function resolveItemThumbnail(itemKey?: string, slot?: string) {
  if (itemKey && ITEM_IMAGE_MAP[itemKey]) {
    return ITEM_IMAGE_MAP[itemKey];
  }

  if (slot) {
    return SLOT_FALLBACK_IMAGE[slot];
  }

  return undefined;
}

function resolveGoldBadge(
  entry: DungeonLogEntry
): LogThumbnailBadge | undefined {
  const delta = entry.delta;
  if (!delta) {
    return undefined;
  }

  const gold = (() => {
    switch (delta.type) {
      case "BATTLE":
        return delta.detail.rewards?.gold;
      case "TREASURE":
        return delta.detail.rewards?.gold;
      case "MOVE":
      case "DEATH":
      case "REVIVE":
      case "REST":
      case "TRAP":
      case "ACQUIRE_ITEM":
      case "EQUIP_ITEM":
      case "UNEQUIP_ITEM":
      case "DISCARD_ITEM":
      case "BUFF_APPLIED":
      case "BUFF_EXPIRED":
      case "LEVEL_UP":
      default:
        return undefined;
    }
  })();

  if (typeof gold !== "number" || gold === 0) {
    return undefined;
  }

  return gold > 0 ? "gain" : "loss";
}

export function buildLogThumbnails(
  entry: DungeonLogEntry
): LogThumbnailDescriptor[] {
  const thumbnails: LogThumbnailDescriptor[] = [];

  if (entry.extra?.type === "BATTLE") {
    const monster = entry.extra.details?.monster;
    const monsterThumbnail = resolveMonsterThumbnail(monster?.spriteId);
    if (monsterThumbnail) {
      thumbnails.push({
        id: `${entry.id}-monster`,
        src: monsterThumbnail,
        alt: monster?.name ?? "몬스터",
      });
    }
  }

  const delta = entry.delta;

  if (
    delta?.type === "EQUIP_ITEM" ||
    delta?.type === "UNEQUIP_ITEM" ||
    delta?.type === "DISCARD_ITEM" ||
    delta?.type === "ACQUIRE_ITEM"
  ) {
    const inventory = delta.detail.inventory;
    const primaryItem =
      inventory.equipped ??
      inventory.unequipped ??
      inventory.added?.at(0) ??
      inventory.removed?.at(0);

    const slot = primaryItem?.slot;
    const itemKey = primaryItem?.code;
    const itemThumbnail = resolveItemThumbnail(itemKey, slot);
    if (itemThumbnail) {
      thumbnails.push({
        id: `${entry.id}-item`,
        src: itemThumbnail,
        alt: itemKey ?? "아이템",
      });
    }
  }

  if (delta?.type === "TREASURE") {
    const rewardItem = delta.detail.rewards?.items?.at(0);
    const itemThumbnail = resolveItemThumbnail(rewardItem?.itemCode, undefined);
    if (itemThumbnail) {
      thumbnails.push({
        id: `${entry.id}-reward-item`,
        src: itemThumbnail,
        alt: rewardItem?.itemCode ?? "보상 아이템",
        badge: "gain",
      });
    }
  }

  const actionThumbnail = resolveActionThumbnail(entry.action);
  if (actionThumbnail) {
    thumbnails.push({
      id: `${entry.id}-action`,
      src: actionThumbnail,
      alt: entry.action,
    });
  }

  const goldBadge = resolveGoldBadge(entry);
  if (goldBadge) {
    thumbnails.push({
      id: `${entry.id}-gold`,
      src: goldImage,
      alt: "골드 변화",
      badge: goldBadge,
    });
  }

  return thumbnails;
}
