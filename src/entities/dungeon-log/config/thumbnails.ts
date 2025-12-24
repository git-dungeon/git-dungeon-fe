import battleImage from "@/assets/battle.png";
import restImage from "@/assets/rest.png";
import trapImage from "@/assets/trap.png";
import treasureImage from "@/assets/treasure.png";
import moveImage from "@/assets/move.png";
import goldImage from "@/assets/gold.png";
import {
  resolveLocalItemSprite,
  resolveLocalMonsterSprite,
} from "@/entities/catalog/config/local-sprites";

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

export function resolveMonsterThumbnail(spriteId?: string, code?: string) {
  return resolveLocalMonsterSprite(code, spriteId);
}

function resolveItemThumbnail(code?: string) {
  return resolveLocalItemSprite(code);
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
  const actionThumbnail = resolveActionThumbnail(entry.action);
  const isBattleAction = entry.action === "BATTLE";
  const isTreasureAction = entry.action === "TREASURE";

  if (actionThumbnail && (isBattleAction || isTreasureAction)) {
    thumbnails.push({
      id: `${entry.id}-action`,
      src: actionThumbnail,
      alt: entry.action,
    });
  }

  if (entry.extra?.type === "BATTLE") {
    const monster = entry.extra.details?.monster;
    const monsterThumbnail = resolveMonsterThumbnail(
      monster?.spriteId,
      monster?.code
    );
    if (monsterThumbnail) {
      thumbnails.push({
        id: `${entry.id}-monster`,
        src: monsterThumbnail,
        alt: monster?.name ?? "몬스터",
      });
    }
  }

  const delta = entry.delta;

  if (delta?.type === "BATTLE") {
    const rewardItem = delta.detail.rewards?.items?.at(0);
    const itemThumbnail = resolveItemThumbnail(rewardItem?.code);
    if (itemThumbnail) {
      thumbnails.push({
        id: `${entry.id}-reward-item`,
        src: itemThumbnail,
        alt: rewardItem?.code ?? "보상 아이템",
        badge: "gain",
      });
    }
  }

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

    const itemKey = primaryItem?.code;
    const itemThumbnail = resolveItemThumbnail(itemKey);
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
    const itemThumbnail = resolveItemThumbnail(rewardItem?.code);
    if (itemThumbnail) {
      thumbnails.push({
        id: `${entry.id}-reward-item`,
        src: itemThumbnail,
        alt: rewardItem?.code ?? "보상 아이템",
        badge: "gain",
      });
    }
  }

  if (actionThumbnail && !isBattleAction && !isTreasureAction) {
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
