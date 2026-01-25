import type { LevelUpOption } from "@/entities/level-up/model/types";
import { LevelUpOptionCard } from "@/widgets/level-up/ui/level-up-option-card";

interface LevelUpOptionGridProps {
  options: LevelUpOption[];
  onSelect: (option: LevelUpOption) => void;
  isPending?: boolean;
}

export function LevelUpOptionGrid({
  options,
  onSelect,
  isPending = false,
}: LevelUpOptionGridProps) {
  return (
    <div className="level-up-option-grid">
      {options.map((option) => (
        <LevelUpOptionCard
          key={option.stat}
          option={option}
          onSelect={onSelect}
          isPending={isPending}
        />
      ))}
    </div>
  );
}
