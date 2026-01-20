import battleImage from "@/assets/event/combat.png";
import deadImage from "@/assets/event/death.png";
import levelUpImage from "@/assets/event/level-up.png";
import restImage from "@/assets/event/rest.png";
import resurrectedImage from "@/assets/event/revive.png";
import trapImage from "@/assets/event/trap.png";
import treasureImage from "@/assets/event/treasure.png";
import moveImage from "@/assets/event/move.png";
import goldImage from "@/assets/event/gold.png";
import emptyImage from "@/assets/event/empty.png";
import {
  resolveLocalItemSprite,
  resolveLocalMonsterSprite,
} from "@/entities/catalog/config/local-sprites";
import { i18next } from "@/shared/i18n/i18n";
import type { EquipmentRarity } from "@/entities/inventory/model/types";

import type {
  DungeonLogEntry,
  DungeonLogAction,
  DungeonLogInventoryDeltaItem,
  DungeonLogRewardItem,
} from "@/entities/dungeon-log/model/types";

export type LogThumbnailBadge = "success" | "danger";

export interface LogThumbnailDescriptor {
  id: string;
  src: string;
  alt: string;
  badge?: LogThumbnailBadge;
  rarity?: EquipmentRarity;
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
  EMPTY: emptyImage,
};

const BADGE_PRESENTATIONS: Record<
  LogThumbnailBadge,
  { icon: "plus" | "minus"; className: string }
> = {
  success: { icon: "plus", className: "pixel-status-badge--success" },
  danger: { icon: "minus", className: "pixel-status-badge--danger" },
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

  return gold > 0 ? "success" : "danger";
}

type ItemNameResolver = (code: string, fallback?: string | null) => string;
type MonsterNameResolver = (code: string, fallback?: string | null) => string;

type ItemRarityResolver = (code: string) => EquipmentRarity | null | undefined;

export interface LogThumbnailResolvers {
  resolveItemName?: ItemNameResolver;
  resolveMonsterName?: MonsterNameResolver;
  resolveItemRarity?: ItemRarityResolver;
}

function normalizeRarity(value?: string) {
  return value === "common" ||
    value === "uncommon" ||
    value === "rare" ||
    value === "epic" ||
    value === "legendary"
    ? (value as EquipmentRarity)
    : undefined;
}

export function buildLogThumbnails(
  entry: DungeonLogEntry,
  {
    resolveItemName,
    resolveMonsterName,
    resolveItemRarity,
  }: LogThumbnailResolvers = {}
): LogThumbnailDescriptor[] {
  const thumbnails: LogThumbnailDescriptor[] = [];
  const resolveName = (code: string) =>
    resolveItemName ? resolveItemName(code, code) : code;
  const resolveRarity = (code: string, rarity?: string) =>
    normalizeRarity(rarity) ?? resolveItemRarity?.(code) ?? undefined;
  const actionThumbnail = resolveActionThumbnail(entry.action);
  const isBattleAction = entry.action === "BATTLE";
  const isTreasureAction = entry.action === "TREASURE";
  const pushRewardItems = (items?: DungeonLogRewardItem[]) => {
    if (!items?.length) {
      return;
    }

    items.forEach((rewardItem, index) => {
      const itemThumbnail = resolveItemThumbnail(rewardItem.code);
      if (!itemThumbnail) {
        return;
      }
      const itemName = resolveName(rewardItem.code);
      const rarity = resolveRarity(rewardItem.code);
      thumbnails.push({
        id: `${entry.id}-reward-item-${index + 1}`,
        src: itemThumbnail,
        alt: itemName ?? t("logs.thumbnails.rewardItem"),
        badge: "success",
        rarity,
      });
    });
  };
  const pushInventoryItems = (
    items: DungeonLogInventoryDeltaItem[] | undefined,
    badge: LogThumbnailBadge
  ) => {
    if (!items?.length) {
      return false;
    }

    let pushed = false;
    items.forEach((item, index) => {
      const itemThumbnail = resolveItemThumbnail(item.code);
      if (!itemThumbnail) {
        return;
      }
      const itemName = resolveName(item.code);
      const rarity = resolveRarity(item.code, item.rarity);
      thumbnails.push({
        id: `${entry.id}-item-${index + 1}`,
        src: itemThumbnail,
        alt: itemName ?? t("logs.thumbnails.item"),
        badge,
        rarity,
      });
      pushed = true;
    });
    return pushed;
  };

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
        ? (resolveMonsterName?.(monster.code, monster.name) ?? monster.name)
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
    pushRewardItems(delta.detail.rewards?.items);
  }

  if (delta?.type === "ACQUIRE_ITEM") {
    const inventory = delta.detail.inventory;
    if (!pushInventoryItems(inventory.added, "success")) {
      const primaryItem =
        inventory.equipped ??
        inventory.unequipped ??
        inventory.added?.at(0) ??
        inventory.removed?.at(0);

      const itemKey = primaryItem?.code;
      const itemThumbnail = resolveItemThumbnail(itemKey);
      if (itemThumbnail) {
        const itemName = itemKey ? resolveName(itemKey) : undefined;
        const rarity =
          itemKey && primaryItem
            ? resolveRarity(itemKey, primaryItem.rarity)
            : undefined;
        thumbnails.push({
          id: `${entry.id}-item`,
          src: itemThumbnail,
          alt: itemName ?? t("logs.thumbnails.item"),
          badge: "success",
          rarity,
        });
      }
    }
  }

  if (
    delta?.type === "EQUIP_ITEM" ||
    delta?.type === "UNEQUIP_ITEM" ||
    delta?.type === "DISCARD_ITEM"
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
      const rarity =
        itemKey && primaryItem
          ? resolveRarity(itemKey, primaryItem.rarity)
          : undefined;
      const badge: LogThumbnailBadge | undefined =
        delta.type === "UNEQUIP_ITEM" || delta.type === "DISCARD_ITEM"
          ? "danger"
          : "success";
      thumbnails.push({
        id: `${entry.id}-item`,
        src: itemThumbnail,
        alt: itemName ?? t("logs.thumbnails.item"),
        badge,
        rarity,
      });
    }
  }

  if (delta?.type === "TREASURE") {
    pushRewardItems(delta.detail.rewards?.items);
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
