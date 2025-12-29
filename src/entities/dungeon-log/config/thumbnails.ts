import battleImage from "@/assets/event/combat.png";
import deadImage from "@/assets/event/death.png";
import levelUpImage from "@/assets/event/level-up.png";
import restImage from "@/assets/event/rest.png";
import resurrectedImage from "@/assets/event/revive.png";
import trapImage from "@/assets/event/trap.png";
import treasureImage from "@/assets/event/treasure.png";
import moveImage from "@/assets/event/move.png";
import goldImage from "@/assets/event/gold.png";
import {
  resolveLocalItemSprite,
  resolveLocalMonsterSprite,
} from "@/entities/catalog/config/local-sprites";
import { i18next } from "@/shared/i18n/i18n";

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

const t = (key: string, options?: Record<string, unknown>) =>
  i18next.t(key, options);

function translate(key: string, fallback: string) {
  const value = t(key);
  return value === key ? fallback : value;
}

const ACTION_IMAGE_MAP: Partial<Record<DungeonLogAction, string>> = {
  BATTLE: battleImage,
  DEATH: deadImage,
  LEVEL_UP: levelUpImage,
  REVIVE: resurrectedImage,
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

type ItemNameResolver = (code: string, fallback?: string | null) => string;
type MonsterNameResolver = (code: string, fallback?: string | null) => string;

export interface LogThumbnailResolvers {
  resolveItemName?: ItemNameResolver;
  resolveMonsterName?: MonsterNameResolver;
}

export function buildLogThumbnails(
  entry: DungeonLogEntry,
  { resolveItemName, resolveMonsterName }: LogThumbnailResolvers = {}
): LogThumbnailDescriptor[] {
  const thumbnails: LogThumbnailDescriptor[] = [];
  const resolveName = (code: string) =>
    resolveItemName ? resolveItemName(code, code) : code;
  const actionThumbnail = resolveActionThumbnail(entry.action);
  const isBattleAction = entry.action === "BATTLE";
  const isTreasureAction = entry.action === "TREASURE";

  if (actionThumbnail && (isBattleAction || isTreasureAction)) {
    thumbnails.push({
      id: `${entry.id}-action`,
      src: actionThumbnail,
      alt: translate(`logs.action.${entry.action}`, entry.action),
    });
  }

  if (entry.extra?.type === "BATTLE") {
    const monster = entry.extra.details?.monster;
    const monsterThumbnail = resolveMonsterThumbnail(
      monster?.spriteId,
      monster?.code
    );
    if (monsterThumbnail) {
      const monsterName = monster
        ? resolveMonsterName
          ? resolveMonsterName(monster.code, monster.name)
          : monster.name
        : undefined;
      thumbnails.push({
        id: `${entry.id}-monster`,
        src: monsterThumbnail,
        alt: monsterName ?? t("logs.thumbnails.monster"),
      });
    }
  }

  const delta = entry.delta;

  if (delta?.type === "BATTLE") {
    const rewardItem = delta.detail.rewards?.items?.at(0);
    const itemThumbnail = resolveItemThumbnail(rewardItem?.code);
    if (itemThumbnail) {
      const itemName = rewardItem?.code
        ? resolveName(rewardItem.code)
        : undefined;
      thumbnails.push({
        id: `${entry.id}-reward-item`,
        src: itemThumbnail,
        alt: itemName ?? t("logs.thumbnails.rewardItem"),
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
      const itemName = itemKey ? resolveName(itemKey) : undefined;
      thumbnails.push({
        id: `${entry.id}-item`,
        src: itemThumbnail,
        alt: itemName ?? t("logs.thumbnails.item"),
      });
    }
  }

  if (delta?.type === "TREASURE") {
    const rewardItem = delta.detail.rewards?.items?.at(0);
    const itemThumbnail = resolveItemThumbnail(rewardItem?.code);
    if (itemThumbnail) {
      const itemName = rewardItem?.code
        ? resolveName(rewardItem.code)
        : undefined;
      thumbnails.push({
        id: `${entry.id}-reward-item`,
        src: itemThumbnail,
        alt: itemName ?? t("logs.thumbnails.rewardItem"),
        badge: "gain",
      });
    }
  }

  if (actionThumbnail && !isBattleAction && !isTreasureAction) {
    thumbnails.push({
      id: `${entry.id}-action`,
      src: actionThumbnail,
      alt: translate(`logs.action.${entry.action}`, entry.action),
    });
  }

  const goldBadge = resolveGoldBadge(entry);
  if (goldBadge) {
    thumbnails.push({
      id: `${entry.id}-gold`,
      src: goldImage,
      alt: t("logs.thumbnails.goldChange"),
      badge: goldBadge,
    });
  }

  return thumbnails;
}
