export const EMBED_THEME_VALUES = ["light", "dark"] as const;
export const EMBED_PREVIEW_SIZE_VALUES = ["compact", "wide"] as const;
export const EMBED_LANGUAGE_VALUES = ["ko", "en"] as const;

export type EmbedPreviewTheme = (typeof EMBED_THEME_VALUES)[number];
export type EmbedPreviewSize = (typeof EMBED_PREVIEW_SIZE_VALUES)[number];
export type EmbedPreviewLanguage = (typeof EMBED_LANGUAGE_VALUES)[number];

export const EQUIPMENT_SLOTS = ["helmet", "armor", "weapon", "ring"] as const;
export type EquipmentSlot = (typeof EQUIPMENT_SLOTS)[number];

export type EquipmentRarity =
  | "common"
  | "uncommon"
  | "rare"
  | "epic"
  | "legendary";

export type EquipmentStat = "hp" | "atk" | "def" | "luck" | "ap";

export interface EquipmentModifier {
  stat: EquipmentStat;
  value: number;
}

export interface InventoryItemEffect {
  type: string;
  description: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  slot: EquipmentSlot;
  rarity: EquipmentRarity;
  modifiers: EquipmentModifier[];
  effect?: InventoryItemEffect;
  sprite: string;
  createdAt: string;
  isEquipped: boolean;
}

export interface CharacterStatValues {
  hp: number;
  maxHp: number;
  atk: number;
  def: number;
  luck: number;
  ap: number;
}

export interface CharacterStatModifier {
  hp: number;
  maxHp: number;
  atk: number;
  def: number;
  luck: number;
  ap: number;
}

export interface CharacterStatSummary {
  total: CharacterStatValues;
  base: CharacterStatValues;
  equipmentBonus: CharacterStatModifier;
}

export interface CharacterFloorStatus {
  current: number;
  best: number;
  progress: number;
}

export interface CharacterOverview {
  level: number;
  exp: number;
  expToLevel: number;
  gold: number;
  ap: number;
  floor: CharacterFloorStatus;
  stats: CharacterStatSummary;
  equipment: InventoryItem[];
}

export interface EmbedRenderParams {
  theme: EmbedPreviewTheme;
  size: EmbedPreviewSize;
  language: EmbedPreviewLanguage;
  overview: CharacterOverview;
}

export type EmbedFontWeight =
  | 100
  | 200
  | 300
  | 400
  | 500
  | 600
  | 700
  | 800
  | 900;

export type EmbedFontStyle = "normal" | "italic";

export interface EmbedFontConfig {
  name: string;
  data: ArrayBuffer;
  weight?: EmbedFontWeight;
  style?: EmbedFontStyle;
}

export type StatTone = "gain" | "loss" | "neutral";
