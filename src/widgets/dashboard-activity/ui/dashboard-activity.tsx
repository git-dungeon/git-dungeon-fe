import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card/card";
import {
  type DashboardActivityViewParams,
  useDashboardActivityView,
} from "@/widgets/dashboard-activity/model/use-dashboard-activity-view";

type DashboardActivityProps = DashboardActivityViewParams;

export function DashboardActivity({
  latestLog,
  apRemaining,
  currentAction,
  lastActionCompletedAt,
  nextActionStartAt,
}: DashboardActivityProps) {
  const { title, message, meta, timestampLabel } = useDashboardActivityView({
    latestLog,
    apRemaining,
    currentAction,
    lastActionCompletedAt,
    nextActionStartAt,
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-5">
        <CardTitle className="text-lg">최근 활동</CardTitle>
        <span className="text-muted-foreground text-xs">{timestampLabel}</span>
      </CardHeader>
      <CardContent className="space-y-1 p-5 pt-0 text-sm">
        <p className="text-foreground font-medium">{title}</p>
        <p className="text-muted-foreground">{message}</p>
        {meta ? <p className="text-muted-foreground text-xs">{meta}</p> : null}
      </CardContent>
    </Card>
  );
}
