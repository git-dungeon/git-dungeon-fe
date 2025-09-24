import type { InventoryItem } from "@/entities/inventory/model/types";
import type { EquipmentSlot } from "@/entities/dashboard/model/types";
import {
  formatModifier,
  formatRarity,
} from "@/entities/dashboard/lib/formatters";
import { formatObtainedAt } from "@/entities/inventory/lib/formatters";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`${item.name} 상세 정보`}
        className="relative w-full max-w-md rounded-2xl border border-neutral-700 bg-neutral-900 text-neutral-100 shadow-[0_20px_60px_rgba(0,0,0,0.45)]"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 transition hover:text-neutral-200"
          aria-label="닫기"
        >
          ✕
        </button>

        <div className="flex flex-col gap-5 p-6">
          <header className="flex items-center gap-4">
            <div className="flex size-16 items-center justify-center rounded-lg border border-neutral-700 bg-neutral-800">
              <img
                src={item.sprite}
                alt={item.name}
                className="size-14 object-cover"
                loading="lazy"
              />
            </div>
            <div>
              <h2 className="text-lg font-semibold">{item.name}</h2>
              <p className="text-primary-300 text-sm">
                {SLOT_LABEL_MAP[slot]} · {formatRarity(item.rarity)}
              </p>
            </div>
          </header>

          <section className="space-y-2 text-sm">
            <h3 className="text-xs tracking-[0.3em] text-neutral-400 uppercase">
              스탯 보너스
            </h3>
            <ul className="space-y-1 rounded-md border border-neutral-700 bg-neutral-800/70 p-3">
              {item.modifiers.map((modifier, index) => (
                <li
                  key={`${item.id}-modifier-${index}`}
                  className="font-medium"
                >
                  {formatModifier(modifier)}
                </li>
              ))}
              {item.modifiers.length === 0 ? (
                <li className="text-neutral-400">추가 보너스 없음</li>
              ) : null}
            </ul>
            <p className="text-xs text-neutral-400">
              획득일: {formatObtainedAt(item.obtainedAt)}
            </p>
          </section>

          {error ? (
            <p className="border-destructive/40 bg-destructive/10 text-destructive rounded-md border p-2 text-xs">
              {error.message}
            </p>
          ) : null}

          <footer className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleEquip}
              disabled={item.isEquipped || isPending}
              className="border-primary bg-primary text-primary-foreground hover:bg-primary/90 flex-1 rounded-md border px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60"
            >
              장착
            </button>
            <button
              type="button"
              onClick={handleUnequip}
              disabled={!item.isEquipped || isPending}
              className="hover:border-primary flex-1 rounded-md border border-neutral-600 bg-neutral-800 px-4 py-2 text-sm font-semibold text-neutral-100 transition disabled:cursor-not-allowed disabled:opacity-60"
            >
              해제
            </button>
            <button
              type="button"
              onClick={handleDiscard}
              disabled={isPending}
              className="border-destructive/70 bg-destructive/20 text-destructive hover:bg-destructive/30 w-full rounded-md border px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60"
            >
              버리기
            </button>
          </footer>
        </div>
      </div>
    </div>
  );
}
