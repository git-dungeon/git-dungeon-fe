import type { AuthSession } from "@/entities/auth/model/types";
import type {
  EquipmentModifier,
  EquipmentRarity,
  EquipmentSlot,
} from "@/entities/dashboard/model/types";
import type { InventoryItemEffect } from "@/entities/inventory/model/types";
export type {
  LanguagePreference,
  ThemePreference,
} from "@/shared/lib/preferences/types";

export interface SettingsProfile extends AuthSession {
  email?: string;
  joinedAt?: string;
  lastLoginAt?: string;
}

export interface SettingsConnections {
  github?: {
    connected: boolean;
    lastSyncAt?: string;
    profileUrl?: string;
  };
}

export interface SettingsData {
  profile: SettingsProfile;
  connections: SettingsConnections;
}

export interface SettingsResponse {
  settings: SettingsData;
}

export type EmbeddingSize = "compact" | "square" | "wide";

export interface EmbeddingStatBlock {
  hp: {
    current: number;
    max: number;
    equipmentBonus?: number;
  };
  atk: {
    total: number;
    equipmentBonus?: number;
  };
  def: {
    total: number;
    equipmentBonus?: number;
  };
  luck: {
    total: number;
    equipmentBonus?: number;
  };
  ap: {
    total: number;
    equipmentBonus?: number;
  };
}

export interface EmbeddingEquipment {
  id: string;
  name: string;
  slot: EquipmentSlot;
  rarity: EquipmentRarity;
  modifiers: EquipmentModifier[];
  effect?: InventoryItemEffect | null;
  sprite: string;
}

export interface EmbeddingPreview {
  userId: string;
  size: EmbeddingSize;
  level: number;
  exp: number;
  expToLevel: number;
  gold: number;
  bestFloor: number;
  currentFloor: number;
  floorProgress: number;
  stats: EmbeddingStatBlock;
  equipment: EmbeddingEquipment[];
  generatedAt: string;
}

export interface EmbeddingPreviewResponse {
  preview: EmbeddingPreview;
}
