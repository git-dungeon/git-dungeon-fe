import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: ({ context, location }) => context.auth.authorize({ location }),
  loader: ({ context }) => context.auth.ensureSession(),
  component: DashboardRoute,
});

function DashboardRoute() {
  return (
    <section className="space-y-4">
      <header>
        <h1 className="text-foreground text-2xl font-semibold">대시보드</h1>
        <p className="text-muted-foreground text-sm">
          캐릭터 상태와 최근 탐험 로그가 표시될 영역입니다.
        </p>
      </header>
      <div className="grid gap-4 md:grid-cols-2">
        <article className="border-border bg-card text-muted-foreground rounded-lg border p-4 text-sm">
          상태 카드, AP, 층수, 골드 등의 요약 카드가 배치됩니다.
        </article>
        <article className="border-border bg-card text-muted-foreground rounded-lg border p-4 text-sm">
          최근 탐험 로그와 활동 그래프가 이곳에 렌더링됩니다.
        </article>
      </div>
    </section>
  );
}
