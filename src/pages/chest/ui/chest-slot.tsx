import { useEffect } from "react";
import { motion, useAnimation } from "motion/react";
import { cn } from "@/shared/lib/utils";
import { InventoryItemCard } from "@/entities/inventory/ui/inventory-item-card";
import type { InventoryItem } from "@/entities/inventory/model/types";
import type { ChestOpenItem } from "@/entities/chest/model/types";
import {
  CONFIRM_DURATION_MS,
  SPIN_DURATION_MS,
  type ChestPhase,
  type ChestRarity,
} from "@/pages/chest/model/use-chest-opening";

interface ChestSlotProps {
  phase: ChestPhase;
  openCycle: number;
  slotRarity: ChestRarity;
  frameTone: string;
  currentItem: ChestOpenItem | null;
  displayItem: InventoryItem | null;
  itemSprite: string | null;
  itemLabel: string;
  emptyAlt: string;
  emptyIcon: string;
}

export function ChestSlot({
  phase,
  openCycle,
  slotRarity,
  frameTone,
  currentItem,
  displayItem,
  itemSprite,
  itemLabel,
  emptyAlt,
  emptyIcon,
}: ChestSlotProps) {
  const controls = useAnimation();
  const rarityTone = `chest-slot--${slotRarity}`;

  useEffect(() => {
    if (phase === "spinning") {
      controls.stop();
      controls.set({ scale: 0.22, opacity: 0.9 });
      void controls.start({
        scale: 1,
        opacity: 1,
        transition: {
          duration: SPIN_DURATION_MS / 1000,
          ease: [0.16, 1, 0.3, 1],
        },
      });
      return;
    }

    if (phase === "confirm") {
      controls.stop();
      controls.set({ scale: 1, opacity: 1 });
      void controls
        .start({
          scale: 1.08,
          transition: { type: "spring", stiffness: 360, damping: 18 },
        })
        .then(() =>
          controls.start({
            scale: 1,
            transition: {
              type: "spring",
              stiffness: 280,
              damping: 22,
              duration: CONFIRM_DURATION_MS / 1000,
            },
          })
        );
      return;
    }

    controls.stop();
    controls.set({ scale: 1, opacity: 1 });
  }, [controls, openCycle, phase]);

  return (
    <div className={cn("pixel-slot chest-slot", rarityTone, frameTone)}>
      <motion.div className="chest-slot-content" animate={controls}>
        {phase === "revealed" && displayItem ? (
          <div className="chest-reveal-card">
            <InventoryItemCard
              item={displayItem}
              truncateName={false}
              className="chest-reveal-card-content"
            />
          </div>
        ) : (
          <div
            className={cn(
              "chest-item",
              (phase === "spinning" || phase === "confirm") &&
                "chest-item--opening"
            )}
          >
            <div className="chest-item-glow"></div>
            {currentItem ? (
              itemSprite ? (
                <img
                  src={itemSprite}
                  alt={itemLabel}
                  className="chest-item-icon"
                />
              ) : (
                <div className="chest-item-label">{itemLabel}</div>
              )
            ) : (
              <img src={emptyIcon} alt={emptyAlt} className="chest-item-icon" />
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
