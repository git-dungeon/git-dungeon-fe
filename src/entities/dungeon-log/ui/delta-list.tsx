import type { DungeonLogEntry } from "@/entities/dungeon-log/model/types";
import { formatDelta } from "@/entities/dungeon-log/lib/formatters";
import { Badge } from "@/shared/ui/badge";
import { cn } from "@/shared/lib/utils";
import { BADGE_TONE_CLASSES } from "@/shared/ui/tone";

interface DeltaListProps {
  entry: DungeonLogEntry;
}

export function DeltaList({ entry }: DeltaListProps) {
  const entries = formatDelta(entry);

  if (entries.length === 0) {
    return null;
  }

  return (
    <ul className="mt-3 flex flex-wrap gap-2">
      {entries.map((item) => (
        <li key={item.id}>
          <Badge
            variant="outline"
            className={cn("border", BADGE_TONE_CLASSES[item.tone])}
          >
            {item.text}
          </Badge>
        </li>
      ))}
    </ul>
  );
}
