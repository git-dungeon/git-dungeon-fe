export type DungeonLogCategory = "exploration" | "status";

export type DungeonAction =
  | "battle"
  | "treasure"
  | "empty"
  | "rest"
  | "trap"
  | "move"
  | "equip"
  | "unequip"
  | "discard";

export type DungeonLogStatus = "started" | "completed";

export interface DungeonLogDelta {
  ap: number;
  hp?: number;
  gold?: number;
  exp?: number;
  item?: string;
  progress?: number;
  slot?: string;
}

export interface DungeonLogEntry {
  id: string;
  category: DungeonLogCategory;
  floor: number;
  action: DungeonAction;
  status: DungeonLogStatus;
  timestamp: string;
  delta: DungeonLogDelta;
}
