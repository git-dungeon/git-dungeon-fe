import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { useTranslation } from "react-i18next";

export function HintCard() {
  const { t } = useTranslation();
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("inventory.hint.title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mt-2">{t("inventory.hint.description")}</p>
      </CardContent>
    </Card>
  );
}
