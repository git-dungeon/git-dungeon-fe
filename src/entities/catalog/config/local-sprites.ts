import missingImage from "@/assets/missing.png";
import leatherCapImage from "@/assets/Leather Cap.png";
import leatherArmorImage from "@/assets/Leather Armor.png";
import woodenSwordImage from "@/assets/Wooden Sword.png";
import copperBandImage from "@/assets/Copper Band.png";
import giantRatImage from "@/assets/Giant Rat.png";

const MONSTER_NAME_CODES = [
  "giant-rat",
  "cave-beetle",
  "zombie",
  "cave-spider",
  "serpent",
  "skeleton-warrior",
  "slime",
  "cave-bat",
  "fire-imp",
  "ancient-dragon",
  "giant-rat-elite",
  "cave-beetle-elite",
  "zombie-elite",
  "cave-spider-elite",
  "serpent-elite",
  "skeleton-warrior-elite",
  "slime-elite",
  "cave-bat-elite",
  "fire-imp-elite",
];

const WEAPON_CODES = [
  "weapon-wooden-sword",
  "weapon-iron-dagger",
  "weapon-short-sword",
  "weapon-steel-sword",
  "weapon-longsword",
  "weapon-battle-axe",
  "weapon-warhammer",
  "weapon-greatsword",
  "weapon-spear-of-valor",
  "weapon-excalibur",
];

const ARMOR_CODES = [
  "armor-leather-armor",
  "armor-iron-shield",
  "armor-chainmail",
  "armor-steel-armor",
  "armor-knights-plate",
  "armor-tower-shield",
  "armor-guardian-armor",
  "armor-dragon-scale",
  "armor-mythril-armor",
  "armor-divine-cloak",
];

const HELMET_CODES = [
  "helmet-leather-cap",
  "helmet-iron-helm",
  "helmet-bronze-helm",
  "helmet-steel-helm",
  "helmet-knights-helm",
  "helmet-horned-helm",
  "helmet-dragon-helm",
  "helmet-shadow-hood",
  "helmet-mythril-helm",
  "helmet-crown-of-valor",
];

const RING_CODES = [
  "ring-copper-band",
  "ring-silver-band",
  "ring-garnet",
  "ring-topaz",
  "ring-sapphire",
  "ring-emerald",
  "ring-ruby-signet",
  "ring-obsidian",
  "ring-mythril",
  "angel-ring",
];

const MONSTER_CODES = [
  ...MONSTER_NAME_CODES,
  ...MONSTER_NAME_CODES.map((code) => `monster-${code}`),
];

const ITEM_CODES = [
  ...WEAPON_CODES,
  ...ARMOR_CODES,
  ...HELMET_CODES,
  ...RING_CODES,
  ...WEAPON_CODES.map((code) => code.replace(/^weapon-/, "")),
  ...ARMOR_CODES.map((code) => code.replace(/^armor-/, "")),
  ...HELMET_CODES.map((code) => code.replace(/^helmet-/, "")),
  ...RING_CODES.map((code) => code.replace(/^ring-/, "")),
];

function buildSpriteMap(codes: string[], overrides: Record<string, string>) {
  const uniqueCodes = Array.from(new Set(codes));
  const base = Object.fromEntries(
    uniqueCodes.map((code) => [code, missingImage])
  );
  return { ...base, ...overrides };
}

const LOCAL_ITEM_SPRITES = buildSpriteMap(ITEM_CODES, {
  "leather-cap": leatherCapImage,
  "helmet-leather-cap": leatherCapImage,
  "leather-armor": leatherArmorImage,
  "armor-leather-armor": leatherArmorImage,
  "wooden-sword": woodenSwordImage,
  "weapon-wooden-sword": woodenSwordImage,
  "copper-band": copperBandImage,
  "ring-copper-band": copperBandImage,
});

const LOCAL_MONSTER_SPRITES = buildSpriteMap(MONSTER_CODES, {
  "giant-rat": giantRatImage,
  "monster-giant-rat": giantRatImage,
});

function normalizeSpriteId(spriteId?: string) {
  if (!spriteId) {
    return undefined;
  }

  const segment = spriteId.split("/").pop() ?? spriteId;
  const withoutExt = segment.replace(/\.(png|jpg|jpeg|svg)$/i, "");
  return withoutExt.replace(/_/g, "-");
}

export function resolveLocalItemSprite(code?: string, spriteId?: string) {
  if (code) {
    return LOCAL_ITEM_SPRITES[code] ?? missingImage;
  }

  const normalized = normalizeSpriteId(spriteId);
  if (!normalized) {
    return undefined;
  }

  return LOCAL_ITEM_SPRITES[normalized] ?? missingImage;
}

export function resolveLocalMonsterSprite(code?: string, spriteId?: string) {
  if (code) {
    return LOCAL_MONSTER_SPRITES[code] ?? missingImage;
  }

  const normalized = normalizeSpriteId(spriteId);
  if (!normalized) {
    return undefined;
  }

  return LOCAL_MONSTER_SPRITES[normalized] ?? missingImage;
}

export { missingImage as MISSING_SPRITE };
