import { renderEmbedSvg } from "@git-dungeon/embed-renderer";
import { loadFontsFromFiles } from "@git-dungeon/embed-renderer/server";

async function example() {
  const fonts = await loadFontsFromFiles([
    {
      name: "Noto Sans KR",
      path: "/path/to/NotoSansKR-Regular.otf",
      weight: 400,
    },
  ]);

  const svg = await renderEmbedSvg({
    theme: "light",
    size: "square",
    language: "ko",
    overview: {
      level: 12,
      exp: 4800,
      expToLevel: 5200,
      gold: 3200,
      ap: 6,
      floor: {
        current: 12,
        best: 18,
        progress: 65,
      },
      stats: {
        total: {
          hp: 2200,
          maxHp: 2200,
          atk: 180,
          def: 160,
          luck: 48,
          ap: 6,
        },
        base: {
          hp: 1800,
          maxHp: 1800,
          atk: 150,
          def: 130,
          luck: 30,
          ap: 4,
        },
        equipmentBonus: {
          hp: 400,
          maxHp: 400,
          atk: 30,
          def: 30,
          luck: 18,
          ap: 2,
        },
      },
      equipment: [],
    },
    fonts,
  });

  console.log(svg);
}

example().catch((error) => {
  console.error("Embed renderer example failed:", error);
});
