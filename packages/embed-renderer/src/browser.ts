import type {
  EmbedFontConfig,
  EmbedFontStyle,
  EmbedFontWeight,
} from "./types";

export interface BrowserFontSource {
  name: string;
  url: string;
  weight?: EmbedFontWeight;
  style?: EmbedFontStyle;
  /**
   * Optional key to reuse cached font data across calls. Defaults to the URL.
   */
  cacheKey?: string;
}

const fontCache = new Map<string, ArrayBuffer>();
const pendingRequests = new Map<string, Promise<ArrayBuffer>>();

async function fetchFontData(source: BrowserFontSource): Promise<ArrayBuffer> {
  const cacheKey = source.cacheKey ?? source.url;
  const cached = fontCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const pending = pendingRequests.get(cacheKey);
  if (pending) {
    return pending;
  }

  const request = fetch(source.url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          `[embed-renderer] 폰트를 불러오지 못했습니다: ${response.status} ${response.statusText}`
        );
      }
      return response.arrayBuffer();
    })
    .then((arrayBuffer) => {
      fontCache.set(cacheKey, arrayBuffer);
      pendingRequests.delete(cacheKey);
      return arrayBuffer;
    })
    .catch((error) => {
      pendingRequests.delete(cacheKey);
      throw error;
    });

  pendingRequests.set(cacheKey, request);
  return request;
}

export async function loadFontsFromUrls(
  sources: BrowserFontSource[]
): Promise<EmbedFontConfig[]> {
  const fonts = await Promise.all(
    sources.map(async (source) => {
      const data = await fetchFontData(source);
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
