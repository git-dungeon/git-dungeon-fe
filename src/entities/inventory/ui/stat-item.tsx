import { cn } from "@/shared/lib/utils";
import { Card, CardContent, CardDescription } from "@/shared/ui/card";

interface StatItemProps {
  title: string;
  value: string;
  caption: string;
}

export function StatItem({ title, value, caption }: StatItemProps) {
  return (
    <Card>
      <CardContent>
        <p className="text-muted-foreground text-xs tracking-wide uppercase">
          {title}
        </p>

        <p className="text-foreground mt-2 text-2xl font-semibold">{value}</p>

        <CardDescription className={cn("mt-1 text-xs")}>
          {caption}
        </CardDescription>
      </CardContent>
    </Card>
  );
}
