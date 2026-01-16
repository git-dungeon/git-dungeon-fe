import type { AppErrorCode } from "./app-error-codes";

export interface AppErrorOptions {
  cause?: unknown;
  meta?: Record<string, unknown>;
}

export class AppError extends Error {
  readonly code: AppErrorCode;
  readonly cause?: unknown;
  readonly meta?: Record<string, unknown>;

  constructor(code: AppErrorCode, message: string, options?: AppErrorOptions) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.cause = options?.cause;
    this.meta = options?.meta;
  }
}

export function createAppError(
  code: AppErrorCode,
  message: string,
  options?: AppErrorOptions
) {
  return new AppError(code, message, options);
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}
