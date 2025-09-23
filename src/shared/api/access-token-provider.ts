export type AccessTokenProvider = () => string | undefined;

let currentProvider: AccessTokenProvider = () => undefined;

export function registerAccessTokenProvider(provider: AccessTokenProvider) {
  currentProvider = provider;
}

export function resetAccessTokenProvider() {
  currentProvider = () => undefined;
}

export function getAccessTokenFromProvider(): string | undefined {
  return currentProvider();
}
