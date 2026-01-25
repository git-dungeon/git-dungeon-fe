import { http } from "msw";
import { LEVEL_UP_ENDPOINTS } from "@/shared/config/env";
import {
  levelUpApplyRequestSchema,
  type LevelUpApplyRequest,
  type LevelUpApplyResponse,
  type LevelUpOption,
  type LevelUpSelectionResponse,
  type LevelUpStatBlock,
} from "@/entities/level-up/model/types";
import { respondWithSuccess } from "@/mocks/lib/api-response";

const OPTION_SETS: LevelUpOption[][] = [
  [
    { stat: "atk", rarity: "rare", value: 3 },
    { stat: "hp", rarity: "common", value: 1 },
    { stat: "def", rarity: "uncommon", value: 2 },
  ],
  [
    { stat: "luck", rarity: "epic", value: 4 },
    { stat: "atk", rarity: "common", value: 1 },
    { stat: "hp", rarity: "uncommon", value: 2 },
  ],
  [
    { stat: "def", rarity: "rare", value: 3 },
    { stat: "luck", rarity: "common", value: 1 },
    { stat: "atk", rarity: "legendary", value: 5 },
  ],
];

let levelUpPoints = 2;
let rollIndex = 0;
let currentStats: LevelUpStatBlock = {
  hp: 32,
  maxHp: 40,
  atk: 18,
  def: 14,
  luck: 6,
};

function buildSelection(): LevelUpSelectionResponse {
  const options = OPTION_SETS[rollIndex % OPTION_SETS.length];

  return {
    points: levelUpPoints,
    rollIndex,
    options,
  };
}

function applySelection(payload: LevelUpApplyRequest): LevelUpApplyResponse {
  const options = OPTION_SETS[rollIndex % OPTION_SETS.length];
  const applied =
    options.find((option) => option.stat === payload.stat) ?? options[0];
  const increment = applied.value ?? 0;

  if (applied.stat === "hp") {
    currentStats = {
      ...currentStats,
      hp: currentStats.hp + increment,
      maxHp: currentStats.maxHp + increment,
    };
  } else {
    currentStats = {
      ...currentStats,
      [applied.stat]: currentStats[applied.stat] + increment,
    } as LevelUpStatBlock;
  }

  levelUpPoints = Math.max(0, levelUpPoints - 1);
  rollIndex += 1;

  return {
    points: levelUpPoints,
    rollIndex,
    applied,
    stats: currentStats,
  };
}

export const levelUpHandlers = [
  http.get(LEVEL_UP_ENDPOINTS.selection, () => {
    return respondWithSuccess(buildSelection());
  }),
  http.post(LEVEL_UP_ENDPOINTS.apply, async ({ request }) => {
    const raw = await request.json();
    const payload = levelUpApplyRequestSchema.parse(raw);
    const response = applySelection(payload);

    return respondWithSuccess(response);
  }),
];
