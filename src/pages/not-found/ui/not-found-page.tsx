import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";

export function NotFoundPage() {
  return (
    <section className="mx-auto w-full max-w-2xl">
      <Card className="border-dashed">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl">페이지를 찾을 수 없습니다.</CardTitle>
          <p className="text-muted-foreground text-sm">
            요청하신 주소가 존재하지 않거나 이동되었습니다.
          </p>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button asChild>
            <a href="/">홈으로 이동</a>
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}
