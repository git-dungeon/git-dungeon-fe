import type { Meta, StoryObj } from "@storybook/react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardAction,
} from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";

const meta: Meta<typeof Card> = {
  title: "shared/Card",
  component: Card,
};

export default meta;

type Story = StoryObj<typeof Card>;

export const Default: Story = {
  render: () => (
    <Card className="max-w-md">
      <CardHeader className="border-b">
        <div>
          <CardTitle>Dungeon Report</CardTitle>
          <CardDescription>최근 탐험 요약</CardDescription>
        </div>
        <CardAction>
          <Button size="sm" variant="secondary">
            상세
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="text-muted-foreground text-sm">
          오늘 3회 탐험 완료, 전리품 2개 획득.
        </div>
      </CardContent>
      <CardFooter className="border-t">
        <Button size="sm">확인</Button>
      </CardFooter>
    </Card>
  ),
};
