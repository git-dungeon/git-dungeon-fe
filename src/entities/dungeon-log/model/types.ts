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
  stats?: DungeonLogStatDelta;
}

export interface DungeonLogStatDelta {
  hp?: number;
  atk?: number;
  def?: number;
  luck?: number;
}

export interface DungeonLogMonster {
  id: string;
  name: string;
  hp: number;
  atk: number;
  sprite?: string;
}

export type DungeonLogDetails =
  | { type: "battle"; monster: DungeonLogMonster }
  | { type: "generic" };

export interface DungeonLogEntry {
  id: string;
  category: DungeonLogCategory;
  floor: number;
  action: DungeonAction;
  status: DungeonLogStatus;
  createdAt: string;
  delta: DungeonLogDelta;
  details?: DungeonLogDetails;
}
