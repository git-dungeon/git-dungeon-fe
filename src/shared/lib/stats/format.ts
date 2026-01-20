export type StatTone = "success" | "danger" | "neutral";

const STAT_LABEL_MAP: Record<string, string> = {
  hp: "HP",
  maxHp: "MAX HP",
  atk: "ATK",
  def: "DEF",
  luck: "LUCK",
  ap: "AP",
};

export function resolveStatLabel(stat: string): string {
  return STAT_LABEL_MAP[stat] ?? stat.toUpperCase();
}

export function formatStatChange(stat: string, value: number) {
  const label = resolveStatLabel(stat);
  const tone: StatTone =
    value > 0 ? "success" : value < 0 ? "danger" : "neutral";
  const prefix = value > 0 ? "+" : value < 0 ? "" : "";
  return {
    label,
    text: `${label} ${prefix}${value}`,
    tone,
  };
}

export function determineItemTone(action: string): StatTone {
  const normalized = action.trim();
  const upper = normalized.toUpperCase();

  if (
    normalized === "treasure" ||
    normalized === "equip" ||
    upper === "TREASURE" ||
    upper === "ACQUIRE_ITEM" ||
    upper === "EQUIP_ITEM" ||
    upper === "BUFF_APPLIED" ||
    upper === "LEVEL_UP" ||
    upper === "REVIVE"
  ) {
    return "success";
  }
  if (
    normalized === "discard" ||
    normalized === "unequip" ||
    upper === "DISCARD_ITEM" ||
    upper === "UNEQUIP_ITEM" ||
    upper === "BUFF_EXPIRED" ||
    upper === "DEATH"
  ) {
    return "danger";
  }
  return "neutral";
}
