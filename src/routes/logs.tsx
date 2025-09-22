import { createFileRoute } from "@tanstack/react-router";
import { requireAuthSession } from "@/features/auth/require-auth/lib/require-auth-session";

export const Route = createFileRoute("/logs")({
  beforeLoad: async (options) => {
    await requireAuthSession(options);
  },
  component: LogsRoute,
});

function LogsRoute() {
  return (
    <section className="space-y-4">
      <header>
        <h1 className="text-foreground text-2xl font-semibold">탐험 로그</h1>
        <p className="text-muted-foreground text-sm">
          던전 진행 내역이 무한 스크롤 리스트로 표시됩니다.
        </p>
      </header>
      <div className="border-border text-muted-foreground rounded-lg border border-dashed p-6 text-sm">
        로그 타임라인 컴포넌트가 연결되면 최신 순으로 데이터를 불러옵니다.
      </div>
    </section>
  );
}
