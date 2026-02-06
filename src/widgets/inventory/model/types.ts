export type InventoryEquippedFilter = "ALL" | "EQUIPPED" | "UNEQUIPPED";
export type InventorySortFilter = "DEFAULT" | "ACQUIRED_DESC" | "ACQUIRED_ASC";

export interface InventoryDateRange {
  start: string;
  end: string;
}
