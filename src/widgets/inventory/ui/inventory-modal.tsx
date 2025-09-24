import type { InventoryItem } from "@/entities/inventory/model/types";
import type { EquipmentSlot } from "@/entities/dashboard/model/types";
import {
  formatModifier,
  formatRarity,
} from "@/entities/dashboard/lib/formatters";
import { formatObtainedAt } from "@/entities/inventory/lib/formatters";
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
  slot: EquipmentSlot | null;
  isPending: boolean;
  error: Error | null;
  onClose: () => void;
  onEquip: (itemId: string) => Promise<unknown>;
  onUnequip: (itemId: string) => Promise<unknown>;
  onDiscard: (itemId: string) => Promise<unknown>;
}

const SLOT_LABEL_MAP: Record<EquipmentSlot, string> = {
  helmet: "투구",
  armor: "방어구",
  weapon: "무기",
  ring: "반지",
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

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      onClose();
    }
  };

  const handleEquip = async () => {
    await onEquip(item.id);
    onClose();
  };

  const handleUnequip = async () => {
    await onUnequip(item.id);
    onClose();
  };

  const handleDiscard = async () => {
    await onDiscard(item.id);
    onClose();
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
              <img
                src={item.sprite}
                alt={item.name}
                className="size-12 object-cover"
                loading="lazy"
              />
            </div>
            <div className="w-full text-left">
              <DialogTitle className="text-lg font-semibold">
                {item.name}
              </DialogTitle>
              <DialogDescription className="text-sm">
                {SLOT_LABEL_MAP[slot]} · {formatRarity(item.rarity)}
              </DialogDescription>
            </div>
          </DialogHeader>

          <section className="flex flex-col gap-2 text-sm">
            <h3 className="text-xs">추가 스탯</h3>
            <ul className="flex flex-wrap gap-2">
              {item.modifiers.map((modifier, index) => (
                <li
                  key={`${item.id}-modifier-${index}`}
                  className="font-medium"
                >
                  <Badge variant="outline">{formatModifier(modifier)}</Badge>
                </li>
              ))}
              {item.modifiers.length === 0 ? <li>추가 스탯 없음</li> : null}
            </ul>
            <p className="text-xs">
              획득일: {formatObtainedAt(item.obtainedAt)}
            </p>
          </section>

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
