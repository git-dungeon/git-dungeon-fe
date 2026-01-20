import type { Meta, StoryObj } from "@storybook/react";
import {
  PixelEmptyState,
  PixelErrorState,
  PixelSkeletonState,
} from "@/shared/ui/pixel-state";
import { PixelButton } from "@/shared/ui/pixel-button";

const meta: Meta<typeof PixelEmptyState> = {
  title: "shared/PixelState",
};

export default meta;

type Story = StoryObj<typeof PixelEmptyState>;

export const Empty: Story = {
  render: () => <PixelEmptyState message="아직 탐험 기록이 없습니다." />,
};

export const ErrorState: Story = {
  render: () => (
    <PixelErrorState
      message="데이터를 불러오지 못했습니다."
      actions={<PixelButton>다시 시도</PixelButton>}
    >
      <p className="text-muted-foreground text-sm">
        잠시 후 다시 시도해주세요.
      </p>
    </PixelErrorState>
  ),
};

export const Loading: Story = {
  render: () => <PixelSkeletonState count={2} />,
};
