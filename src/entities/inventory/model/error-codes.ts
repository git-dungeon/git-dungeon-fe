export const INVENTORY_ERROR_CODES = [
  "INVENTORY_VERSION_MISMATCH",
  "INVENTORY_RATE_LIMITED",
] as const;

export type InventoryErrorCode = (typeof INVENTORY_ERROR_CODES)[number];

export function isInventoryErrorCode(
  value: unknown
): value is InventoryErrorCode {
  return (
    typeof value === "string" &&
    INVENTORY_ERROR_CODES.includes(value as InventoryErrorCode)
  );
}
