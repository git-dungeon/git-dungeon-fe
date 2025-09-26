import type { DungeonLogEntry } from "@/entities/dungeon-log/model/types";
import {
  buildLogDescription,
  resolveActionLabel,
} from "@/entities/dungeon-log/lib/formatters";
import {
  buildLogThumbnails,
  resolveThumbnailBadgePresentation,
} from "@/entities/dungeon-log/config/thumbnails";
import { DeltaList } from "@/entities/dungeon-log/ui/delta-list";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";

interface DungeonLogDetailDialogProps {
  log: DungeonLogEntry | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DungeonLogDetailDialog({
  log,
  open,
  onOpenChange,
}: DungeonLogDetailDialogProps) {
  const thumbnails = log ? buildLogThumbnails(log) : [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="space-y-6 sm:max-w-lg">
        {log ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-left">
                {resolveActionLabel(log.action)}
              </DialogTitle>
              <DialogDescription className="text-left">
                {buildLogDescription(log)}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-2">
              <p className="text-muted-foreground text-xs">관련 이미지</p>
              <div className="flex flex-wrap gap-3">
                {thumbnails.length > 0 ? (
                  thumbnails.map((thumbnail) => {
                    const badgeStyles = resolveThumbnailBadgePresentation(
                      thumbnail.badge
                    );
                    return (
                      <div
                        key={thumbnail.id}
                        className="border-border bg-muted relative h-16 w-16 overflow-hidden rounded-md border"
                      >
                        <img
                          src={thumbnail.src}
                          alt={thumbnail.alt}
                          className="h-full w-full object-cover"
                        />
                        {badgeStyles ? (
                          <span
                            className={`absolute top-1 left-1 flex h-5 w-5 items-center justify-center rounded-full text-xs font-semibold text-white ${badgeStyles.className}`}
                          >
                            {badgeStyles.label}
                          </span>
                        ) : null}
                      </div>
                    );
                  })
                ) : (
                  <p className="text-muted-foreground text-sm">
                    표시할 이미지가 없습니다.
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-muted-foreground text-xs">변동 내역</p>
              <DeltaList delta={log.delta} />
            </div>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
