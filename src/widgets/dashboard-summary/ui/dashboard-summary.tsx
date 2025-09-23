import type { DashboardState } from "@/entities/dashboard/model/types";
import { buildSummaryCards } from "@/entities/dashboard/lib/formatters";
import { SummaryCard } from "@/entities/dashboard/ui/summary-card";

interface DashboardSummaryProps {
  state: DashboardState;
}

export function DashboardSummary({ state }: DashboardSummaryProps) {
  const { combat, resources } = buildSummaryCards(state);

  return (
    <section className="grid gap-4 lg:grid-cols-2">
      <div className="grid gap-4 sm:grid-cols-2">
        {combat.map((card) => (
          <SummaryCard
            key={card.title}
            title={card.title}
            value={card.value}
            caption={card.caption}
          />
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {resources.map((card) => (
          <SummaryCard
            key={card.title}
            title={card.title}
            value={card.value}
            caption={card.caption}
          />
        ))}
      </div>
    </section>
  );
}
