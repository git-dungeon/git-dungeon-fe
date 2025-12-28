import type { DungeonLogEntry } from "@/entities/dungeon-log/model/types";
import { formatDelta } from "@/entities/dungeon-log/lib/formatters";
import { useCatalogItemNameResolver } from "@/entities/catalog/model/use-catalog-item-name";
import { Badge } from "@/shared/ui/badge";
import { cn } from "@/shared/lib/utils";
import { BADGE_TONE_CLASSES } from "@/shared/ui/tone";

interface DeltaListProps {
  entry: DungeonLogEntry;
}

export function DeltaList({ entry }: DeltaListProps) {
  const resolveItemName = useCatalogItemNameResolver();
  const entries = formatDelta(entry, resolveItemName);

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
