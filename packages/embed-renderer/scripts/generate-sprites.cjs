const fs = require("fs");
const path = require("path");

const embedRendererRoot = path.resolve(__dirname, "..");
const defaultRepoRoot = path.resolve(embedRendererRoot, "../../..");

const PATH_ENV = {
  repoRoot: ["EMBED_RENDERER_REPO_ROOT", "REPO_ROOT"],
  catalogPath: ["EMBED_RENDERER_CATALOG_PATH", "CATALOG_PATH"],
  assetsRoot: ["EMBED_RENDERER_ASSETS_ROOT", "ASSETS_ROOT"],
  outputPath: ["EMBED_RENDERER_OUTPUT_PATH", "OUTPUT_PATH"],
};

function resolveEnvPath(envValue, fallback) {
  if (!envValue) {
    return fallback;
  }
  return path.isAbsolute(envValue)
    ? envValue
    : path.resolve(process.cwd(), envValue);
}

function getEnvValue(keys) {
  return keys.map((key) => process.env[key]).find(Boolean) ?? null;
}

function formatEnvKeys(keys) {
  return keys.join(" or ");
}

function assertFileExists(filePath, label, envKeys) {
  if (!fs.existsSync(filePath)) {
    throw new Error(
      `[embed-renderer] ${label} not found: ${filePath}\n` +
        `Set ${formatEnvKeys(envKeys)} to the correct path (absolute or relative to CWD).`
    );
  }
  const stat = fs.statSync(filePath);
  if (!stat.isFile()) {
    throw new Error(`[embed-renderer] ${label} is not a file: ${filePath}`);
  }
}

function assertDirExists(dirPath, label, envKeys) {
  if (!fs.existsSync(dirPath)) {
    throw new Error(
      `[embed-renderer] ${label} not found: ${dirPath}\n` +
        `Set ${formatEnvKeys(envKeys)} to the correct directory (absolute or relative to CWD).`
    );
  }
  const stat = fs.statSync(dirPath);
  if (!stat.isDirectory()) {
    throw new Error(`[embed-renderer] ${label} is not a directory: ${dirPath}`);
  }
}

const repoRoot = resolveEnvPath(
  getEnvValue(PATH_ENV.repoRoot),
  defaultRepoRoot
);
const catalogPath = resolveEnvPath(
  getEnvValue(PATH_ENV.catalogPath),
  path.join(repoRoot, "git-dungeon-be", "config", "catalog", "items.json")
);
const assetsRoot = resolveEnvPath(
  getEnvValue(PATH_ENV.assetsRoot),
  path.join(repoRoot, "git-dungeon-fe", "src", "assets")
);
const outputPath = resolveEnvPath(
  getEnvValue(PATH_ENV.outputPath),
  path.join(embedRendererRoot, "src", "assets", "sprites.ts")
);

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
  assertFileExists(catalogPath, "catalog items.json", PATH_ENV.catalogPath);
  assertDirExists(assetsRoot, "assets root", PATH_ENV.assetsRoot);
  assertDirExists(path.dirname(outputPath), "output directory", PATH_ENV.outputPath);

  let catalog;
  try {
    const raw = fs.readFileSync(catalogPath, "utf8");
    catalog = JSON.parse(raw);
  } catch (error) {
    throw new Error(
      `[embed-renderer] failed to read catalog JSON: ${catalogPath}\n` +
        `Ensure the file exists and is valid JSON. Original error: ${error instanceof Error ? error.message : String(error)}`
    );
  }
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
