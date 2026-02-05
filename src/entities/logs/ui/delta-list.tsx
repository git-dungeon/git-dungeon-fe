import type { LogEntry } from "@/entities/logs/model/types";
import { formatDelta } from "@/entities/logs/lib/formatters";
import { useCatalogItemNameResolver } from "@/entities/catalog/model/use-catalog-item-name";
import { PixelPill } from "@/shared/ui/pixel-pill";

interface DeltaListProps {
  entry: LogEntry;
}

export function DeltaList({ entry }: DeltaListProps) {
  const resolveItemName = useCatalogItemNameResolver();
  const entries = formatDelta(entry, { resolveItemName });

  if (entries.length === 0) {
    return null;
  }

  return (
    <ul className="mt-3 flex flex-wrap gap-2">
      {entries.map((item) => {
        const iconTone =
          item.icon ??
          (item.tone === "success"
            ? "up"
            : item.tone === "danger"
              ? "down"
              : undefined);

        return (
          <li key={item.id}>
            <PixelPill tone={item.tone} icon={iconTone} className="text-[10px]">
              {item.text}
            </PixelPill>
          </li>
        );
      })}
    </ul>
  );
}
