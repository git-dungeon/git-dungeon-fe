export type DungeonAction =
  | "battle"
  | "treasure"
  | "empty"
  | "rest"
  | "trap"
  | "move";

export type DungeonLogStatus = "started" | "completed";

export interface DungeonLogDelta {
  ap: number;
  hp?: number;
  gold?: number;
  exp?: number;
  item?: string;
  progress?: number;
}

export interface DungeonLogEntry {
  id: string;
  floor: number;
  action: DungeonAction;
  status: DungeonLogStatus;
  timestamp: string;
  delta: DungeonLogDelta;
}
