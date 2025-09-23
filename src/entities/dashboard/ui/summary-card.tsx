import { Card, CardContent, CardDescription } from "@/shared/ui/card/card";

interface SummaryCardProps {
  title: string;
  value: string;
  caption: string;
}

export function SummaryCard({ title, value, caption }: SummaryCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <p className="text-muted-foreground text-xs tracking-wide uppercase">
          {title}
        </p>
        <p className="text-foreground mt-2 text-2xl font-semibold">{value}</p>
        <CardDescription className="mt-1 text-xs">{caption}</CardDescription>
      </CardContent>
    </Card>
  );
}
