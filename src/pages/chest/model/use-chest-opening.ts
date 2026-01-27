import { useCallback, useEffect, useRef, useState } from "react";
import type { TFunction } from "i18next";
import confetti from "canvas-confetti";
import { animate } from "motion";
import type { QueryClient } from "@tanstack/react-query";
import { postChestOpen } from "@/entities/chest/api/post-chest-open";
import type { ChestOpenItem } from "@/entities/chest/model/types";
import { DASHBOARD_STATE_QUERY_KEY } from "@/entities/dashboard/model/dashboard-state-query";

export const OPENING_DURATION_MS = 2000;
export const SPIN_DURATION_MS = 1600;
export const CONFIRM_DURATION_MS = OPENING_DURATION_MS - SPIN_DURATION_MS;

const SPIN_MIN_STEP_MS = 60;
const SPIN_MAX_STEP_MS = 200;

export type ChestPhase = "idle" | "spinning" | "confirm" | "revealed";
export type ChestRarity = ChestOpenItem["rarity"];

const SPIN_POOL: ChestOpenItem[] = [
  {
    itemId: "spin-weapon-wooden-sword",
    code: "weapon-wooden-sword",
    slot: "weapon",
    rarity: "common",
    quantity: 1,
  },
  {
    itemId: "spin-weapon-steel-sword",
    code: "weapon-steel-sword",
    slot: "weapon",
    rarity: "uncommon",
    quantity: 1,
  },
  {
    itemId: "spin-armor-chainmail",
    code: "armor-chainmail",
    slot: "armor",
    rarity: "rare",
    quantity: 1,
  },
  {
    itemId: "spin-helmet-dragon-helm",
    code: "helmet-dragon-helm",
    slot: "helmet",
    rarity: "epic",
    quantity: 1,
  },
  {
    itemId: "spin-ring-angel-ring",
    code: "angel-ring",
    slot: "ring",
    rarity: "legendary",
    quantity: 1,
  },
];

function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function resolveStepMs(progress: number) {
  const eased = progress * progress;
  return SPIN_MIN_STEP_MS + (SPIN_MAX_STEP_MS - SPIN_MIN_STEP_MS) * eased;
}

function pickSpinItem(
  pool: ChestOpenItem[],
  finalItem: ChestOpenItem | null,
  progress: number
) {
  if (finalItem && progress > 0.7 && Math.random() < 0.7) {
    return finalItem;
  }
  return pickRandom(pool);
}

interface UseChestOpeningParams {
  unopenedChests: number;
  queryClient: QueryClient;
  t: TFunction;
}

export function useChestOpening({
  unopenedChests,
  queryClient,
  t,
}: UseChestOpeningParams) {
  const [phase, setPhase] = useState<ChestPhase>("idle");
  const [currentItem, setCurrentItem] = useState<ChestOpenItem | null>(null);
  const [finalItem, setFinalItem] = useState<ChestOpenItem | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [openCycle, setOpenCycle] = useState(0);

  const spinAnimationRef = useRef<ReturnType<typeof animate> | null>(null);
  const confirmAnimationRef = useRef<ReturnType<typeof animate> | null>(null);
  const spinNextChangeRef = useRef(0);
  const spinTokenRef = useRef(0);
  const confirmTokenRef = useRef(0);
  const pendingRef = useRef(false);
  const skipPendingRef = useRef(false);

  useEffect(() => {
    return () => {
      spinAnimationRef.current?.stop?.();
      confirmAnimationRef.current?.stop?.();
    };
  }, []);

  const stopConfirm = useCallback(() => {
    confirmTokenRef.current += 1;
    confirmAnimationRef.current?.stop?.();
    confirmAnimationRef.current = null;
  }, []);

  const stopSpin = useCallback(() => {
    spinTokenRef.current += 1;
    spinAnimationRef.current?.stop?.();
    spinAnimationRef.current = null;
    spinNextChangeRef.current = 0;
  }, []);

  const stopAnimations = useCallback(() => {
    stopSpin();
    stopConfirm();
  }, [stopConfirm, stopSpin]);

  const revealItem = useCallback(
    (item: ChestOpenItem) => {
      stopAnimations();
      setCurrentItem(item);
      setFinalItem(item);
      setPhase("revealed");
      if (typeof window !== "undefined") {
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch {
          // Canvas가 없는 환경(jsdom 등)에서는 연출을 생략한다.
        }
      }
    },
    [stopAnimations]
  );

  const startSpin = useCallback(
    (finalItem: ChestOpenItem | null) => {
      const pool = finalItem ? [finalItem, ...SPIN_POOL] : SPIN_POOL;

      if (typeof window === "undefined") {
        setCurrentItem(finalItem ?? pickRandom(pool));
        return;
      }

      stopAnimations();
      spinNextChangeRef.current = 0;
      const spinToken = spinTokenRef.current;
      setCurrentItem(pickRandom(pool));

      spinAnimationRef.current = animate(0, 1, {
        duration: SPIN_DURATION_MS / 1000,
        ease: "linear",
        onUpdate: (progress) => {
          if (spinTokenRef.current !== spinToken) {
            return;
          }
          if (progress >= spinNextChangeRef.current) {
            setCurrentItem(pickSpinItem(pool, finalItem, progress));
            spinNextChangeRef.current =
              progress + resolveStepMs(progress) / SPIN_DURATION_MS;
          }
        },
        onComplete: () => {
          if (spinTokenRef.current !== spinToken) {
            return;
          }
          if (!finalItem) {
            setPhase("idle");
            return;
          }
          setCurrentItem(finalItem);
          setPhase("confirm");
          confirmTokenRef.current += 1;
          const confirmToken = confirmTokenRef.current;
          confirmAnimationRef.current = animate(0, 1, {
            duration: CONFIRM_DURATION_MS / 1000,
            ease: "linear",
            onComplete: () => {
              if (confirmTokenRef.current !== confirmToken) {
                return;
              }
              revealItem(finalItem);
            },
          });
        },
      });
    },
    [revealItem, stopAnimations]
  );

  const isOpening = phase === "spinning" || phase === "confirm";
  const shouldDisableOpen =
    unopenedChests <= 0 || isOpening || pendingRef.current;

  const buttonLabel = (() => {
    if (isOpening) {
      return t("chest.page.opening");
    }
    if (unopenedChests <= 0) {
      return t("chest.page.empty");
    }
    return t("chest.page.open");
  })();

  const handleOpen = useCallback(async () => {
    if (shouldDisableOpen) {
      return;
    }

    setError(null);
    pendingRef.current = true;
    skipPendingRef.current = false;
    setPhase("spinning");
    setOpenCycle((prev) => prev + 1);
    setFinalItem(null);
    setCurrentItem(null);
    stopAnimations();

    try {
      const response = await postChestOpen();
      const item = response.items[0] ?? null;
      setFinalItem(item);

      const shouldSkipNow = skipPendingRef.current && item;
      skipPendingRef.current = false;

      if (shouldSkipNow && item) {
        revealItem(item);
      } else {
        startSpin(item);
      }

      await queryClient.invalidateQueries({
        queryKey: DASHBOARD_STATE_QUERY_KEY,
      });
    } catch {
      setPhase("idle");
      stopAnimations();
      setError(t("chest.page.error"));
    } finally {
      pendingRef.current = false;
      skipPendingRef.current = false;
    }
  }, [
    queryClient,
    revealItem,
    shouldDisableOpen,
    startSpin,
    stopAnimations,
    t,
  ]);

  const handleSkip = useCallback(() => {
    if (phase !== "spinning" && phase !== "confirm") {
      return;
    }

    skipPendingRef.current = true;

    if (finalItem) {
      revealItem(finalItem);
      skipPendingRef.current = false;
      return;
    }

    if (currentItem) {
      revealItem(currentItem);
      skipPendingRef.current = false;
    }
  }, [currentItem, finalItem, phase, revealItem]);

  const slotRarity: ChestRarity =
    (phase === "confirm" || phase === "revealed"
      ? finalItem?.rarity
      : currentItem?.rarity) ?? "common";
  const frameTone =
    phase === "revealed"
      ? "chest-slot--revealed"
      : phase === "spinning" || phase === "confirm"
        ? "chest-slot--opening"
        : "";

  return {
    phase,
    currentItem,
    finalItem,
    error,
    openCycle,
    shouldDisableOpen,
    buttonLabel,
    handleOpen,
    handleSkip,
    slotRarity,
    frameTone,
  };
}
