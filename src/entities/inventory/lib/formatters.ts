const EFFECT_LABEL_MAP: Record<string, string> = {
  resurrection: "부활",
};

export function formatInventoryEffect(effect: string): string {
  return EFFECT_LABEL_MAP[effect] ?? effect;
}
