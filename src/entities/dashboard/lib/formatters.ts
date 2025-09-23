import type {
  DashboardState,
  EquipmentModifier,
  EquipmentRarity,
} from "@/entities/dashboard/model/types";

const RARITY_LABEL_MAP: Record<EquipmentRarity, string> = {
  common: "일반",
  uncommon: "고급",
  rare: "희귀",
  epic: "영웅",
  legendary: "전설",
};

const MODIFIER_LABEL_MAP: Record<EquipmentModifier["stat"], string> = {
  ap: "AP",
  atk: "ATK",
  def: "DEF",
  hp: "HP",
  luck: "LUCK",
};

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("ko-KR").format(value);
}

export function formatRarity(rarity: EquipmentRarity): string {
  return RARITY_LABEL_MAP[rarity] ?? rarity;
}

export function formatModifier(modifier: EquipmentModifier): string {
  const label =
    MODIFIER_LABEL_MAP[modifier.stat] ?? modifier.stat.toUpperCase();
  const valuePrefix = modifier.value > 0 ? "+" : "";
  return `${label} ${valuePrefix}${modifier.value}`;
}

export function buildSummaryCards(state: DashboardState) {
  const maxFloorLabel = state.maxFloor ?? state.floor;
  const floorLabel = `지하 ${state.floor.toString().padStart(2, "0")}층`;
  const maxFloorText = `지하 ${maxFloorLabel.toString().padStart(2, "0")}층`;
  const floorProgress = Math.max(0, state.floorProgress ?? 0);
  const normalizedProgress = Math.min(floorProgress, 200);

  const combat = [
    {
      title: "현재 층 / 최고층",
      value: `${floorLabel} / ${maxFloorText}`,
      caption: "탐험 중인 층과 도달한 최고층",
    },
    {
      title: "HP",
      value: `${state.hp} / ${state.maxHp}`,
      caption: "현재 / 최대 체력",
    },
    {
      title: "ATK",
      value: state.atk.toString(),
      caption: "공격력",
    },
    {
      title: "DEF",
      value: state.def.toString(),
      caption: "방어력",
    },
    {
      title: "LUCK",
      value: state.luck.toString(),
      caption: "행운",
    },
  ];

  const resources = [
    {
      title: "층 진행도",
      value: `${Math.round(normalizedProgress)}%`,
      caption: "100%가 되면 자동으로 다음 층으로 이동",
    },
    {
      title: "Gold",
      value: formatNumber(state.gold),
      caption: "보유 골드",
    },
    {
      title: "경험치",
      value: `${state.exp} / ${state.expToLevel}`,
      caption: "다음 레벨까지 필요 EXP",
    },
    {
      title: "남은 AP",
      value: state.ap.toString(),
      caption: "자동 탐험에 사용 가능한 AP",
    },
    {
      title: "레벨",
      value: state.level.toString(),
      caption: "현재 캐릭터 레벨",
    },
  ];

  return {
    combat,
    resources,
  };
}
