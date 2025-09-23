import type { DungeonLogDelta } from "@/entities/dungeon-log/model/types";
import { formatDelta } from "@/entities/dungeon-log/lib/formatters";
import { Badge } from "@/shared/ui/badge/badge";

interface DeltaListProps {
  delta: DungeonLogDelta;
}

export function DeltaList({ delta }: DeltaListProps) {
  const entries = formatDelta(delta);

  if (entries.length === 0) {
    return null;
  }

  return (
    <ul className="mt-3 flex flex-wrap gap-2">
      {entries.map((entry, index) => (
        <li key={`${entry}-${index}`}>
          <Badge variant="outline">{entry}</Badge>
        </li>
      ))}
    </ul>
  );
}
