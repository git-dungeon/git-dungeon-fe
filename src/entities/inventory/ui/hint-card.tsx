import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";

export function HintCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>팁</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mt-2">
          슬롯 또는 인벤토리 아이템을 클릭해 상세 정보를 확인하고 장착을
          변경해보세요.
        </p>
      </CardContent>
    </Card>
  );
}
