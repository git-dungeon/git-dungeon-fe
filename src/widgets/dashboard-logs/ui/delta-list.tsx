import type { DungeonLogDelta } from "@/entities/dungeon-log/model/types";
import { formatDelta } from "@/entities/dungeon-log/lib/formatters";

interface DeltaListProps {
  delta: DungeonLogDelta;
}

export function DeltaList({ delta }: DeltaListProps) {
  const entries = formatDelta(delta);

  if (entries.length === 0) {
    return null;
  }

  return (
    <ul className="text-muted-foreground mt-3 flex flex-wrap gap-2 text-xs">
      {entries.map((entry, index) => (
        <li
          key={`${entry}-${index}`}
          className="border-border rounded-full border px-2 py-1"
        >
          {entry}
        </li>
      ))}
    </ul>
  );
}
