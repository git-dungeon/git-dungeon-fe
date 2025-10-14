import express from "express";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { renderEmbedSvg } from "@git-dungeon/embed-renderer";
import { loadFontsFromFiles } from "@git-dungeon/embed-renderer/server";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = Number.parseInt(process.env.PORT ?? "4173", 10);

const fontPath = path.resolve(
  __dirname,
  "../../../src/shared/assets/fonts/NotoSansKR-Regular.otf"
);

let cachedFontsPromise = null;

async function ensureFonts() {
  if (!cachedFontsPromise) {
    cachedFontsPromise = loadFontsFromFiles([
      {
        name: "Noto Sans KR",
        path: fontPath,
        weight: 400,
      },
    ]);
  }
  return cachedFontsPromise;
}

const sampleOverview = {
  level: 18,
  exp: 8800,
  expToLevel: 9500,
  gold: 5400,
  ap: 4,
  floor: {
    current: 18,
    best: 21,
    progress: 72,
  },
  stats: {
    total: {
      hp: 3100,
      maxHp: 3100,
      atk: 260,
      def: 220,
      luck: 58,
      ap: 4,
    },
    base: {
      hp: 2500,
      maxHp: 2500,
      atk: 210,
      def: 180,
      luck: 40,
      ap: 3,
    },
    equipmentBonus: {
      hp: 600,
      maxHp: 600,
      atk: 50,
      def: 40,
      luck: 18,
      ap: 1,
    },
  },
  equipment: [
    {
      id: "weapon-longsword",
      name: "Longsword",
      slot: "weapon",
      rarity: "rare",
      modifiers: [{ stat: "atk", value: 5 }],
    },
    {
      id: "helmet-steel-helm",
      name: "Steel Helm",
      slot: "helmet",
      rarity: "uncommon",
      modifiers: [
        { stat: "def", value: 4 },
        { stat: "hp", value: 2 },
      ],
    },
    {
      id: "armor-steel-armor",
      name: "Steel Armor",
      slot: "armor",
      rarity: "uncommon",
      modifiers: [
        { stat: "def", value: 4 },
        { stat: "luck", value: 1 },
      ],
    },
    {
      id: "ring-topaz",
      name: "Topaz Ring",
      slot: "ring",
      rarity: "uncommon",
      modifiers: [
        { stat: "luck", value: 2 },
        { stat: "hp", value: 2 },
      ],
    },
  ],
};

app.get("/embed.svg", async (req, res) => {
  try {
    const theme = req.query.theme === "dark" ? "dark" : "light";
    const size =
      req.query.size === "compact" || req.query.size === "wide"
        ? req.query.size
        : "square";
    const language = req.query.lang === "en" ? "en" : "ko";

    const fonts = await ensureFonts();

    const svg = await renderEmbedSvg({
      theme,
      size,
      language,
      overview: sampleOverview,
      fonts,
    });

    res.type("image/svg+xml").send(svg);
  } catch (error) {
    console.error("[express-example] Failed to render SVG", error);
    res.status(500).json({
      message: "Failed to render SVG",
      error: error?.message ?? "unknown",
    });
  }
});

app.get("/", (_req, res) => {
  res.type("text/html").send(`
    <html>
      <body style="font-family: sans-serif; padding: 24px;">
        <h1>Embed Renderer Express Example</h1>
        <p>
          <a href="/embed.svg" target="_blank">Open /embed.svg</a>
        </p>
        <p>Append query parameters to test variants:</p>
        <ul>
          <li><code>?theme=dark</code></li>
          <li><code>?size=compact</code> or <code>?size=wide</code></li>
          <li><code>?lang=en</code></li>
        </ul>
      </body>
    </html>
  `);
});

app.listen(port, () => {
  console.log(`Embed renderer example listening on http://localhost:${port}`);
});
