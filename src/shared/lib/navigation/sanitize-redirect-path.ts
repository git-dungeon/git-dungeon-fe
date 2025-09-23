const INTERNAL_PATH_PATTERN = /^\/(?!\/)/;
const PROTOCOL_PATTERN = /:\/\//;
const WHITESPACE_PATTERN = /\s/;

function isSafePath(candidate: string): boolean {
  if (!candidate) {
    return false;
  }

  if (!INTERNAL_PATH_PATTERN.test(candidate)) {
    return false;
  }

  if (candidate.startsWith("//")) {
    return false;
  }

  if (PROTOCOL_PATTERN.test(candidate)) {
    return false;
  }

  if (WHITESPACE_PATTERN.test(candidate)) {
    return false;
  }

  return true;
}

export function sanitizeRedirectPath(
  input?: string,
  fallback: string = "/"
): string {
  const safeFallback = isSafePath(fallback) ? fallback : "/";

  if (!input) {
    return safeFallback;
  }

  let candidate = input;
  try {
    candidate = decodeURIComponent(input);
  } catch {
    // keep original candidate when decoding fails
  }

  candidate = candidate.trim();

  if (!isSafePath(candidate)) {
    return safeFallback;
  }

  return candidate;
}
