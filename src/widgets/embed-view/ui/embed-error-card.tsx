import { Button } from "@/shared/ui/button";

interface EmbedErrorCardProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export function EmbedErrorCard({
  title = "잘못된 요청입니다",
  message,
  onRetry,
}: EmbedErrorCardProps) {
  return (
    <section className="bg-card text-card-foreground max-w-lg space-y-4 rounded-xl border px-6 py-8 text-center shadow-sm">
      <div className="space-y-2">
        <h1 className="text-foreground text-lg font-semibold">{title}</h1>
        <p className="text-muted-foreground text-sm">{message}</p>
      </div>
      {onRetry ? (
        <Button size="sm" onClick={onRetry}>
          다시 시도
        </Button>
      ) : null}
    </section>
  );
}
