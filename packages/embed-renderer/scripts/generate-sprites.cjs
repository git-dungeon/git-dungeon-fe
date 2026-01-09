const fs = require("fs");
const path = require("path");

const embedRendererRoot = path.resolve(__dirname, "..");
const repoRoot = path.resolve(embedRendererRoot, "../../..");
const catalogPath = path.join(
  repoRoot,
  "git-dungeon-be",
  "config",
  "catalog",
  "items.json"
);
const assetsRoot = path.join(repoRoot, "git-dungeon-fe", "src", "assets");
const outputPath = path.join(embedRendererRoot, "src", "assets", "sprites.ts");

function toDataUrl(filePath) {
  const buffer = fs.readFileSync(filePath);
  const base64 = buffer.toString("base64");
  return `data:image/png;base64,${base64}`;
}

function resolveSpriteAssetPath(item) {
  if (!item?.slot || !item?.code) {
    return null;
  }

  const slot = item.slot;
  const prefix = `${slot}-`;
  let baseName = item.code;
  if (baseName.startsWith(prefix)) {
    baseName = baseName.slice(prefix.length);
  }

  const primary = path.join(assetsRoot, slot, `${baseName}.png`);
  if (fs.existsSync(primary)) {
    return primary;
  }

  if (slot === "ring" && !baseName.endsWith("-ring")) {
    const ringPath = path.join(assetsRoot, slot, `${baseName}-ring.png`);
    if (fs.existsSync(ringPath)) {
      return ringPath;
    }
  }

  if (item.spriteId) {
    const spriteKey = item.spriteId.replace(/^sprite\//, "");
    let spriteBase = spriteKey;
    if (spriteBase.startsWith(prefix)) {
      spriteBase = spriteBase.slice(prefix.length);
    }
    const fallback = path.join(assetsRoot, slot, `${spriteBase}.png`);
    if (fs.existsSync(fallback)) {
      return fallback;
    }
  }

  return null;
}

function main() {
  const raw = fs.readFileSync(catalogPath, "utf8");
  const catalog = JSON.parse(raw);
  const items = Array.isArray(catalog.items) ? catalog.items : [];

  const spriteMap = {};
  const missing = [];

  for (const item of items) {
    const resolvedPath = resolveSpriteAssetPath(item);
    if (!resolvedPath) {
      missing.push({ code: item.code, slot: item.slot, spriteId: item.spriteId });
      continue;
    }

    spriteMap[item.code] = toDataUrl(resolvedPath);
  }

  if (missing.length) {
    const details = missing
      .map(
        (entry) =>
          `- ${entry.code ?? "unknown"} (${entry.slot ?? "unknown"}, ${
            entry.spriteId ?? "no-sprite"
          })`
      )
      .join("\n");
    throw new Error(
      `[embed-renderer] missing sprite assets for ${missing.length} items:\n${details}`
    );
  }

  const header = `/* eslint-disable */\n/* prettier-ignore */\n// THIS FILE IS AUTO-GENERATED. DO NOT EDIT MANUALLY.\n`;
  const entries = Object.entries(spriteMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `  \"${key}\": \"${value}\",`)
    .join("\n");

  const content = `${header}export const SPRITE_DATA_URLS: Record<string, string> = {\n${entries}\n};\n\nexport type SpriteDataUrlKey = keyof typeof SPRITE_DATA_URLS;\n\nconst ASSET_EXT_REGEX = /\\.(png|jpg|jpeg|svg)$/i;\n\nexport function resolveSpriteDataUrl(value: string | null | undefined): string | null {\n  if (!value) {\n    return null;\n  }\n  if (value.startsWith(\"data:\") || value.startsWith(\"http://\") || value.startsWith(\"https://\") || value.startsWith(\"/\")) {\n    return null;\n  }\n  const normalized = value.replace(/^sprite\\//, \"\").replace(ASSET_EXT_REGEX, \"\");\n  return SPRITE_DATA_URLS[normalized] ?? null;\n}\n`;

  fs.writeFileSync(outputPath, content, "utf8");
}

main();
