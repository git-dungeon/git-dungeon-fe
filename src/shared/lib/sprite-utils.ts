const BASE_COLORS = ["#1f2937", "#0f172a", "#4b5563", "#111827"];

function pickColorFromSeed(seed: string): string {
  if (!seed) {
    return BASE_COLORS[0];
  }

  const hash = Array.from(seed).reduce(
    (acc, char) => acc + char.charCodeAt(0),
    0
  );
  const index = hash % BASE_COLORS.length;

  return BASE_COLORS[index];
}

function createSpriteDataUri(label: string, color: string): string {
  const safeLabel = label.slice(0, 2).toUpperCase();
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><rect width='64' height='64' rx='10' fill='${color}'/><text x='50%' y='52%' font-size='26' text-anchor='middle' fill='white' font-family='Inter, Arial, sans-serif' font-weight='700'>${safeLabel}</text></svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export function createSpriteFromName(name: string): string {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const color = pickColorFromSeed(name);

  return createSpriteDataUri(initials, color);
}

export function createSpriteFromLabel(label: string, color: string): string {
  return createSpriteDataUri(label, color);
}
