import type { LogThumbnailDescriptor } from "@/entities/dungeon-log/config/thumbnails";
import { resolveThumbnailBadgePresentation } from "@/entities/dungeon-log/config/thumbnails";
import { cn } from "@/shared/lib/utils";

interface LogThumbnailStackProps {
  thumbnails: LogThumbnailDescriptor[];
}

const BASE_SIZE = 64;
const ITEM_OFFSET = 14;

export function LogThumbnailStack({ thumbnails }: LogThumbnailStackProps) {
  if (thumbnails.length === 0) {
    return null;
  }

  const maxIndex = Math.max(thumbnails.length - 1, 0);
  const containerWidth = BASE_SIZE + Math.min(maxIndex * ITEM_OFFSET, 40);

  return (
    <div
      className="relative"
      style={{ width: `${containerWidth}px`, height: `${BASE_SIZE}px` }}
    >
      {thumbnails.map((thumbnail, index) => {
        const offset = Math.min(index * ITEM_OFFSET, 40);
        const badgeStyles = resolveThumbnailBadgePresentation(thumbnail.badge);
        const rarityClass = thumbnail.rarity
          ? `rarity-${thumbnail.rarity}`
          : null;
        return (
          <div
            key={thumbnail.id}
            className={cn(
              "pixel-log-thumb absolute top-0 h-16 w-16 overflow-hidden",
              rarityClass
            )}
            style={{ left: `${offset}px`, zIndex: thumbnails.length - index }}
          >
            <img
              src={thumbnail.src}
              alt={thumbnail.alt}
              className="h-full w-full object-cover"
            />
            {badgeStyles ? (
              <span
                className={cn(
                  "absolute top-1 left-1 flex h-5 w-5 items-center justify-center rounded-full text-xs font-semibold text-white",
                  badgeStyles.className
                )}
              >
                {badgeStyles.label}
              </span>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
