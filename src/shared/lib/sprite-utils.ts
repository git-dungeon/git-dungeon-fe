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

const BASE64_CHARS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

function encodeBytesToBase64(bytes: Uint8Array): string {
  let output = "";

  for (let i = 0; i < bytes.length; i += 3) {
    const a = bytes[i];
    const b = bytes[i + 1];
    const c = bytes[i + 2];
    const triple = (a << 16) | ((b ?? 0) << 8) | (c ?? 0);

    output += BASE64_CHARS[(triple >> 18) & 63];
    output += BASE64_CHARS[(triple >> 12) & 63];
    output += typeof b === "number" ? BASE64_CHARS[(triple >> 6) & 63] : "=";
    output += typeof c === "number" ? BASE64_CHARS[triple & 63] : "=";
  }

  return output;
}

function encodeSvgToBase64(svg: string): string {
  const bufferCtor = (
    globalThis as {
      Buffer?: {
        from: (
          input: string,
          encoding: string
        ) => { toString: (encoding: string) => string };
      };
    }
  ).Buffer;

  if (bufferCtor) {
    return bufferCtor.from(svg, "utf8").toString("base64");
  }

  if (typeof TextEncoder !== "undefined") {
    const encoder = new TextEncoder();
    return encodeBytesToBase64(encoder.encode(svg));
  }

  throw new Error(
    "[sprite-utils] Base64 encoder is not available in this environment."
  );
}

function createSpriteDataUri(label: string, color: string): string {
  const safeLabel = label.slice(0, 2).toUpperCase();
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><rect width='64' height='64' rx='10' fill='${color}'/><text x='50%' y='52%' font-size='26' text-anchor='middle' fill='white' font-family='Inter, Arial, sans-serif' font-weight='700'>${safeLabel}</text></svg>`;
  const base64 = encodeSvgToBase64(svg);

  return `data:image/svg+xml;base64,${base64}`;
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
