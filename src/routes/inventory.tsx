import { createFileRoute } from "@tanstack/react-router";
import { requireAuthSession } from "@/features/auth/require-auth/lib/require-auth-session";

export const Route = createFileRoute("/inventory")({
  beforeLoad: async (options) => {
    await requireAuthSession(options);
  },
  component: InventoryRoute,
});

function InventoryRoute() {
  return (
    <section className="space-y-4">
      <header>
        <h1 className="text-foreground text-2xl font-semibold">인벤토리</h1>
        <p className="text-muted-foreground text-sm">
          보유 중인 장비와 장착 관리 UI가 렌더링될 영역입니다.
        </p>
      </header>
      <div className="border-border text-muted-foreground rounded-lg border border-dashed p-6 text-sm">
        장비 리스트, 필터, 장착 액션 컴포넌트가 추가될 예정입니다.
      </div>
    </section>
  );
}
