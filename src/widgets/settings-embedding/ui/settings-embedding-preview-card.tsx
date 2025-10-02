import { useMemo, useState } from "react";
import type { EmbeddingSize } from "@/entities/settings/model/types";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { Button, buttonVariants } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";
import { formatDateTime } from "@/shared/lib/datetime/formatters";
import { DashboardEmbeddingBanner } from "@/widgets/dashboard-embedding/ui/dashboard-embedding-banner";
import { useCharacterOverview } from "@/features/character-summary/model/use-character-overview";
import type { CharacterOverview } from "@/features/character-summary/lib/build-character-overview";

const EMBEDDING_SIZE_OPTIONS: Array<{
  value: EmbeddingSize;
  label: string;
  hint: string;
}> = [
  { value: "compact", label: "Compact", hint: "블로그 사이드바" },
  { value: "square", label: "Square", hint: "README 카드" },
  { value: "wide", label: "Wide", hint: "대시보드 배너" },
];

export function SettingsEmbeddingPreviewCard() {
  const [size, setSize] = useState<EmbeddingSize>("compact");
  const overview = useCharacterOverview();

  const isPending = overview.isLoading || overview.isFetching;
  const character = overview.data;

  const generatedAtLabel = useMemo(() => {
    return formatDateTime(new Date());
  }, []);

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>캐릭터 대시보드</CardTitle>
          <CardDescription>
            대시보드와 인벤토리 데이터를 조합한 임베딩 미리보기입니다.
          </CardDescription>
        </div>
        <CardAction className="flex items-center gap-2">
          {EMBEDDING_SIZE_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              className={cn(
                buttonVariants({
                  variant: option.value === size ? "default" : "outline",
                  size: "sm",
                }),
                "flex flex-col gap-0 text-xs"
              )}
              onClick={() => setSize(option.value)}
              disabled={isPending}
            >
              <span>{option.label}</span>
              <span className="text-muted-foreground text-[10px]">
                {option.hint}
              </span>
            </button>
          ))}
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-6">
        {overview.isError
          ? renderErrorState(overview.refetch)
          : isPending
            ? renderSkeletonPreview()
            : character
              ? renderPreviewContent(size, character, generatedAtLabel)
              : null}
      </CardContent>
    </Card>
  );
}

function renderPreviewContent(
  size: EmbeddingSize,
  character: CharacterOverview,
  generatedAtLabel: string
) {
  const layoutClassName = resolveLayoutClassName(size);

  return (
    <div className="space-y-4">
      <DashboardEmbeddingBanner
        level={character.level}
        exp={character.exp}
        expToLevel={character.expToLevel}
        gold={character.gold}
        ap={character.ap}
        floor={character.floor}
        stats={character.stats}
        equipment={character.equipment}
        layoutClassName={layoutClassName}
      />
      <div className="text-muted-foreground flex flex-col gap-2 text-xs sm:flex-row sm:items-center sm:justify-between">
        <span>생성 시각: {generatedAtLabel}</span>
        <span>
          URL 예시:{" "}
          <code className="font-mono text-xs">
            /render?userId=me&amp;size={size}
          </code>
        </span>
      </div>
    </div>
  );
}

function renderErrorState(onRetry: () => Promise<void>) {
  return (
    <div className="bg-destructive/5 text-destructive border-destructive/20 flex flex-col items-start gap-3 rounded-lg border p-6">
      <div>
        <p className="font-semibold">미리보기를 불러오지 못했습니다.</p>
        <p className="text-destructive/80 text-sm">
          네트워크 상태를 확인한 뒤 다시 시도하세요.
        </p>
      </div>
      <Button variant="destructive" size="sm" onClick={() => void onRetry()}>
        다시 시도
      </Button>
    </div>
  );
}

function renderSkeletonPreview() {
  return (
    <div className="space-y-4">
      <div className="bg-muted/20 h-64 animate-pulse rounded-2xl" />
      <div className="bg-muted/20 h-4 w-1/3 animate-pulse rounded" />
    </div>
  );
}

function resolveLayoutClassName(size: EmbeddingSize): string | undefined {
  if (size === "compact") {
    return "p-4 text-sm";
  }

  if (size === "wide") {
    return "p-8";
  }

  return undefined;
}
