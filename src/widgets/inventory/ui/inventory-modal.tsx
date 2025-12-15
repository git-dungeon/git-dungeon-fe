import type { InventoryItem } from "@/entities/inventory/model/types";
import type { InventoryItemSlot } from "@/entities/inventory/model/types";
import { formatRarity } from "@/entities/dashboard/lib/formatters";
import { formatInventoryEffect } from "@/entities/inventory/lib/formatters";
import { formatDateTime } from "@/shared/lib/datetime/formatters";
import { cn } from "@/shared/lib/utils";
import { formatStatChange, resolveStatLabel } from "@/shared/lib/stats/format";
import { BADGE_TONE_CLASSES } from "@/shared/ui/tone";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";

interface InventoryModalProps {
  item: InventoryItem | null;
  slot: InventoryItemSlot | null;
  isPending: boolean;
  error: Error | null;
  onClose: () => void;
  onEquip: (itemId: string) => Promise<unknown>;
  onUnequip: (itemId: string) => Promise<unknown>;
  onDiscard: (itemId: string) => Promise<unknown>;
}

const SLOT_LABEL_MAP: Record<InventoryItemSlot, string> = {
  helmet: "투구",
  armor: "방어구",
  weapon: "무기",
  ring: "반지",
  consumable: "소모품",
};

export function InventoryModal({
  item,
  slot,
  isPending,
  error,
  onClose,
  onEquip,
  onUnequip,
  onDiscard,
}: InventoryModalProps) {
  if (!item || !slot) {
    return null;
  }

  const displayName = item.name ?? item.code;

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      onClose();
    }
  };

  const handleEquip = async () => {
    try {
      await onEquip(item.id);
      onClose();
    } catch {
      // 에러는 상위에서 전달된 상태로 표시한다.
    }
  };

  const handleUnequip = async () => {
    try {
      await onUnequip(item.id);
      onClose();
    } catch {
      // 에러는 상위에서 전달된 상태로 표시한다.
    }
  };

  const handleDiscard = async () => {
    try {
      await onDiscard(item.id);
      onClose();
    } catch {
      // 에러는 상위에서 전달된 상태로 표시한다.
    }
  };

  return (
    <Dialog open onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md gap-0">
        <DialogClose asChild>
          <Button
            variant="ghost"
            size="icon"
            aria-label="닫기"
            className="absolute top-4 right-4"
          >
            ✕
          </Button>
        </DialogClose>
        <div className="flex flex-col gap-2">
          <DialogHeader className="flex-row items-start gap-2">
            <div className="flex size-12 shrink-0 items-center justify-center">
              {item.sprite ? (
                <img
                  src={item.sprite}
                  alt={displayName}
                  className="size-12 object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="border-border bg-muted text-muted-foreground flex size-12 items-center justify-center rounded-md border text-xs font-semibold">
                  {displayName.slice(0, 2).toUpperCase()}
                </div>
              )}
            </div>
            <div className="w-full text-left">
              <DialogTitle className="text-lg font-semibold">
                {displayName}
              </DialogTitle>
              <DialogDescription className="text-sm">
                {SLOT_LABEL_MAP[slot]} · {formatRarity(item.rarity)}
              </DialogDescription>
            </div>
          </DialogHeader>

          <section className="flex flex-col gap-2 text-sm">
            <h3 className="text-xs">추가 스탯</h3>
            <ul className="flex flex-wrap gap-2">
              {item.modifiers
                .filter((modifier) => modifier.kind === "stat")
                .map((modifier, index) => {
                  const label = resolveStatLabel(modifier.stat);
                  const { text, tone } =
                    modifier.mode === "percent"
                      ? {
                          text: `${label} ${modifier.value > 0 ? "+" : ""}${modifier.value}%`,
                          tone:
                            modifier.value > 0
                              ? ("gain" as const)
                              : modifier.value < 0
                                ? ("loss" as const)
                                : ("neutral" as const),
                        }
                      : formatStatChange(modifier.stat, modifier.value);

                  return (
                    <li
                      key={`${item.id}-modifier-${index}`}
                      className="font-medium"
                    >
                      <Badge
                        variant="outline"
                        className={cn("text-[10px]", BADGE_TONE_CLASSES[tone])}
                      >
                        {text}
                      </Badge>
                    </li>
                  );
                })}
              {item.modifiers.filter((m) => m.kind === "stat").length === 0 ? (
                <li>추가 스탯 없음</li>
              ) : null}
            </ul>
          </section>

          {item.effect ? (
            <section className="flex flex-col gap-2 text-sm">
              <h3 className="text-xs">특수 효과</h3>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline">
                  {formatInventoryEffect(item.effect)}
                </Badge>
              </div>
            </section>
          ) : null}

          <p className="text-xs">획득일: {formatDateTime(item.createdAt)}</p>

          {error ? (
            <p className="text-destructive text-xs">{error.message}</p>
          ) : null}

          <DialogFooter className="gap-2">
            <Button
              type="button"
              onClick={handleEquip}
              disabled={item.isEquipped || isPending}
              className="flex-1"
            >
              장착
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleUnequip}
              disabled={!item.isEquipped || isPending}
              className="flex-1"
            >
              해제
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDiscard}
              disabled={isPending}
              className="text-background flex-1"
            >
              버리기
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
