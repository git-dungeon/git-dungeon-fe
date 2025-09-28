export type StatTone = "gain" | "loss" | "neutral";

const STAT_LABEL_MAP: Record<string, string> = {
  hp: "HP",
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
  const tone: StatTone = value > 0 ? "gain" : value < 0 ? "loss" : "neutral";
  const prefix = value > 0 ? "+" : value < 0 ? "" : "";
  return {
    label,
    text: `${label} ${prefix}${value}`,
    tone,
  };
}

export function determineItemTone(action: string): StatTone {
  if (action === "treasure" || action === "equip") {
    return "gain";
  }
  if (action === "discard" || action === "unequip") {
    return "loss";
  }
  return "neutral";
}
