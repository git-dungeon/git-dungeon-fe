import battleImage from "@/assets/battle.png";
import emptyImage from "@/assets/empty.png";
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
  DungeonAction,
  DungeonLogEntry,
} from "@/entities/dungeon-log/model/types";

export type LogThumbnailBadge = "gain" | "loss";

export interface LogThumbnailDescriptor {
  id: string;
  src: string;
  alt: string;
  badge?: LogThumbnailBadge;
}

const ACTION_IMAGE_MAP: Partial<Record<DungeonAction, string>> = {
  battle: battleImage,
  treasure: treasureImage,
  empty: emptyImage,
  rest: restImage,
  trap: trapImage,
  move: moveImage,
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
  "Giant Rat": giantRatImage,
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

export function resolveActionThumbnail(action: DungeonAction) {
  return ACTION_IMAGE_MAP[action];
}

function resolveItemThumbnail(itemName?: string, slot?: string) {
  if (!itemName && slot) {
    return SLOT_FALLBACK_IMAGE[slot];
  }

  if (!itemName) {
    return undefined;
  }

  return (
    ITEM_IMAGE_MAP[itemName] ?? (slot ? SLOT_FALLBACK_IMAGE[slot] : undefined)
  );
}

function resolveGoldBadge(
  entry: DungeonLogEntry
): LogThumbnailBadge | undefined {
  if (typeof entry.delta.gold !== "number" || entry.delta.gold === 0) {
    return undefined;
  }

  return entry.delta.gold > 0 ? "gain" : "loss";
}

export function buildLogThumbnails(
  entry: DungeonLogEntry
): LogThumbnailDescriptor[] {
  const thumbnails: LogThumbnailDescriptor[] = [];

  if (entry.action === "equip" || entry.action === "unequip") {
    const itemThumbnail = resolveItemThumbnail(
      entry.delta.item,
      entry.delta.slot
    );
    if (itemThumbnail) {
      thumbnails.push({
        id: `${entry.id}-item`,
        src: itemThumbnail,
        alt: entry.delta.item ?? "장비",
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

  const isDiscardAction = entry.action === "discard";

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

  if (entry.delta.item) {
    const itemThumbnail = resolveItemThumbnail(
      entry.delta.item,
      entry.delta.slot
    );
    if (itemThumbnail) {
      thumbnails.push({
        id: `${entry.id}-item`,
        src: itemThumbnail,
        alt: entry.delta.item,
        badge:
          entry.action === "treasure"
            ? "gain"
            : isDiscardAction
              ? "loss"
              : undefined,
      });
    }
  }

  return thumbnails;
}
