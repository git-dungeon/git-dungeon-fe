import { readFile } from "node:fs/promises";
import type {
  EmbedFontConfig,
  EmbedFontStyle,
  EmbedFontWeight,
} from "./types";

export interface ServerFontSource {
  name: string;
  path: string;
  weight?: EmbedFontWeight;
  style?: EmbedFontStyle;
  cacheKey?: string;
}

const resolvedCache = new Map<string, ArrayBuffer>();
const pendingCache = new Map<string, Promise<ArrayBuffer>>();

async function readFontData(source: ServerFontSource): Promise<ArrayBuffer> {
  const cacheKey = source.cacheKey ?? source.path;
  const cached = resolvedCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const pending = pendingCache.get(cacheKey);
  if (pending) {
    return pending;
  }

  const request = readFile(source.path)
    .then((buffer) => {
      const arrayBuffer = buffer.buffer.slice(
        buffer.byteOffset,
        buffer.byteOffset + buffer.byteLength
      ) as ArrayBuffer;
      resolvedCache.set(cacheKey, arrayBuffer);
      pendingCache.delete(cacheKey);
      return arrayBuffer;
    })
    .catch((error) => {
      pendingCache.delete(cacheKey);
      throw error;
    });

  pendingCache.set(cacheKey, request);
  return request;
}

export async function loadFontsFromFiles(
  sources: ServerFontSource[]
): Promise<EmbedFontConfig[]> {
  const fonts = await Promise.all(
    sources.map(async (source) => {
      const data = await readFontData(source);
      return {
        name: source.name,
        data,
        weight: source.weight,
        style: source.style,
      } satisfies EmbedFontConfig;
    })
  );

  return fonts;
}
