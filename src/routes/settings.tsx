import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent } from "@/shared/ui/card";

export const Route = createFileRoute("/settings")({
  beforeLoad: ({ context, location }) => context.auth.authorize({ location }),
  loader: ({ context }) => context.auth.ensureSession(),
  component: SettingsRoute,
});

function SettingsRoute() {
  return (
    <section className="space-y-4">
      <header>
        <h1 className="text-foreground text-2xl font-semibold">설정</h1>
        <p className="text-muted-foreground text-sm">
          테마, 언어, 임베딩 배너 미리보기를 이곳에서 관리합니다.
        </p>
      </header>
      <Card className="border-dashed">
        <CardContent className="text-muted-foreground p-6 text-sm">
          환경설정 폼과 미리보기 위젯이 추가될 예정입니다.
        </CardContent>
      </Card>
    </section>
  );
}
