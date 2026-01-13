import missingImage from "@/assets/event/missing.png";

import battleAxeImage from "@/assets/weapon/battle-axe.png";
import excaliburImage from "@/assets/weapon/excalibur.png";
import greatswordImage from "@/assets/weapon/greatsword.png";
import ironDaggerImage from "@/assets/weapon/iron-dagger.png";
import longswordImage from "@/assets/weapon/longsword.png";
import shortSwordImage from "@/assets/weapon/short-sword.png";
import spearOfValorImage from "@/assets/weapon/spear-of-valor.png";
import steelSwordImage from "@/assets/weapon/steel-sword.png";
import warhammerImage from "@/assets/weapon/warhammer.png";
import woodenSwordImage from "@/assets/weapon/wooden-sword.png";

import bastionArmorImage from "@/assets/armor/bastion-armor.png";
import chainmailImage from "@/assets/armor/chainmail.png";
import divineCloakImage from "@/assets/armor/divine-cloak.png";
import dragonScaleImage from "@/assets/armor/dragon-scale.png";
import guardianArmorImage from "@/assets/armor/guardian-armor.png";
import knightsPlateImage from "@/assets/armor/knights-plate.png";
import leatherArmorImage from "@/assets/armor/leather-armor.png";
import mythrilArmorImage from "@/assets/armor/mythril-armor.png";
import steelArmorImage from "@/assets/armor/steel-armor.png";
import studdedLeatherArmorImage from "@/assets/armor/studded-leather-armor.png";

import bronzeHelmImage from "@/assets/helmet/bronze-helm.png";
import crownOfValorImage from "@/assets/helmet/crown-of-valor.png";
import dragonHelmImage from "@/assets/helmet/dragon-helm.png";
import hornedHelmImage from "@/assets/helmet/horned-helm.png";
import ironHelmImage from "@/assets/helmet/iron-helm.png";
import knightsHelmImage from "@/assets/helmet/knights-helm.png";
import leatherCapImage from "@/assets/helmet/leather-cap.png";
import mythrilHelmImage from "@/assets/helmet/mythril-helm.png";
import shadowHoodImage from "@/assets/helmet/shadow-hood.png";
import steelHelmImage from "@/assets/helmet/steel-helm.png";

import angelRingImage from "@/assets/ring/angel-ring.png";
import copperBandImage from "@/assets/ring/copper-band.png";
import emeraldRingImage from "@/assets/ring/emerald-ring.png";
import garnetRingImage from "@/assets/ring/garnet-ring.png";
import mythrilRingImage from "@/assets/ring/mythril-ring.png";
import obsidianRingImage from "@/assets/ring/obsidian-ring.png";
import rubySignetImage from "@/assets/ring/ruby-signet.png";
import sapphireRingImage from "@/assets/ring/sapphire-ring.png";
import silverBandImage from "@/assets/ring/silver-band.png";
import topazRingImage from "@/assets/ring/topaz-ring.png";

import ancientDragonImage from "@/assets/monster/ancient-dragon.png";
import caveBatImage from "@/assets/monster/cave-bat.png";
import caveBeetleImage from "@/assets/monster/cave-beetle.png";
import caveSpiderImage from "@/assets/monster/cave-spider.png";
import fireImpImage from "@/assets/monster/fire-imp.png";
import giantRatImage from "@/assets/monster/giant-rat.png";
import serpentImage from "@/assets/monster/serpent.png";
import skeletonWarriorImage from "@/assets/monster/skeleton-warrior.png";
import slimeImage from "@/assets/monster/slime.png";
import zombieImage from "@/assets/monster/zombie.png";

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
  "armor-studded-leather-armor",
  "armor-chainmail",
  "armor-steel-armor",
  "armor-knights-plate",
  "armor-bastion-armor",
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

function withPrefix(prefix: string, map: Record<string, string>) {
  return Object.fromEntries(
    Object.entries(map).flatMap(([key, value]) => [
      [`${prefix}-${key}`, value],
      [key, value],
    ])
  );
}

const WEAPON_SPRITES: Record<string, string> = {
  "wooden-sword": woodenSwordImage,
  "iron-dagger": ironDaggerImage,
  "short-sword": shortSwordImage,
  "steel-sword": steelSwordImage,
  longsword: longswordImage,
  "battle-axe": battleAxeImage,
  warhammer: warhammerImage,
  greatsword: greatswordImage,
  "spear-of-valor": spearOfValorImage,
  excalibur: excaliburImage,
};

const ARMOR_SPRITES: Record<string, string> = {
  "leather-armor": leatherArmorImage,
  "studded-leather-armor": studdedLeatherArmorImage,
  "iron-shield": studdedLeatherArmorImage,
  chainmail: chainmailImage,
  "steel-armor": steelArmorImage,
  "knights-plate": knightsPlateImage,
  "bastion-armor": bastionArmorImage,
  "tower-shield": bastionArmorImage,
  "guardian-armor": guardianArmorImage,
  "dragon-scale": dragonScaleImage,
  "mythril-armor": mythrilArmorImage,
  "divine-cloak": divineCloakImage,
};

const HELMET_SPRITES: Record<string, string> = {
  "leather-cap": leatherCapImage,
  "iron-helm": ironHelmImage,
  "bronze-helm": bronzeHelmImage,
  "steel-helm": steelHelmImage,
  "knights-helm": knightsHelmImage,
  "horned-helm": hornedHelmImage,
  "dragon-helm": dragonHelmImage,
  "shadow-hood": shadowHoodImage,
  "mythril-helm": mythrilHelmImage,
  "crown-of-valor": crownOfValorImage,
};

const RING_SPRITES: Record<string, string> = {
  "copper-band": copperBandImage,
  "silver-band": silverBandImage,
  garnet: garnetRingImage,
  topaz: topazRingImage,
  sapphire: sapphireRingImage,
  emerald: emeraldRingImage,
  "ruby-signet": rubySignetImage,
  obsidian: obsidianRingImage,
  mythril: mythrilRingImage,
  "angel-ring": angelRingImage,
};

const LOCAL_ITEM_SPRITES = buildSpriteMap(ITEM_CODES, {
  ...withPrefix("weapon", WEAPON_SPRITES),
  ...withPrefix("armor", ARMOR_SPRITES),
  ...withPrefix("helmet", HELMET_SPRITES),
  ...withPrefix("ring", RING_SPRITES),
});

const BASE_MONSTER_SPRITES = buildSpriteMap(MONSTER_CODES, {
  "ancient-dragon": ancientDragonImage,
  "monster-ancient-dragon": ancientDragonImage,
  "cave-bat": caveBatImage,
  "monster-cave-bat": caveBatImage,
  "cave-beetle": caveBeetleImage,
  "monster-cave-beetle": caveBeetleImage,
  "cave-spider": caveSpiderImage,
  "monster-cave-spider": caveSpiderImage,
  "fire-imp": fireImpImage,
  "monster-fire-imp": fireImpImage,
  "giant-rat": giantRatImage,
  "monster-giant-rat": giantRatImage,
  serpent: serpentImage,
  "monster-serpent": serpentImage,
  "skeleton-warrior": skeletonWarriorImage,
  "monster-skeleton-warrior": skeletonWarriorImage,
  slime: slimeImage,
  "monster-slime": slimeImage,
  zombie: zombieImage,
  "monster-zombie": zombieImage,
});

const ELITE_MONSTER_SPRITES = withPrefix(
  "monster",
  Object.fromEntries(
    MONSTER_NAME_CODES.map((code) => [
      `${code}-elite`,
      BASE_MONSTER_SPRITES[code] ?? missingImage,
    ])
  )
);

const LOCAL_MONSTER_SPRITES = {
  ...BASE_MONSTER_SPRITES,
  ...ELITE_MONSTER_SPRITES,
};

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
    const resolved = LOCAL_ITEM_SPRITES[code];
    if (resolved) {
      return resolved;
    }
  }

  const normalized = normalizeSpriteId(spriteId);
  if (!normalized) {
    return code ? missingImage : undefined;
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

  const resolved = LOCAL_MONSTER_SPRITES[normalized];
  if (resolved && resolved !== missingImage) {
    return resolved;
  }

  return missingImage;
}

export { missingImage as MISSING_SPRITE };
