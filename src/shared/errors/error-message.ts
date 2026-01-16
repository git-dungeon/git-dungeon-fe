import type { AppErrorCode } from "./app-error-codes";

const ERROR_MESSAGE_KEY_PREFIX = "errors";

export function getErrorMessageKey(code: AppErrorCode) {
  return `${ERROR_MESSAGE_KEY_PREFIX}.${code}`;
}
