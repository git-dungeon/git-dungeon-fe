import type { Meta, StoryObj } from "@storybook/react";
import { toast } from "sonner";
import { Toaster } from "@/shared/ui/sonner";
import { PixelButton } from "@/shared/ui/pixel-button";

const meta: Meta<typeof Toaster> = {
  title: "shared/Sonner",
  component: Toaster,
};

export default meta;

type Story = StoryObj<typeof Toaster>;

export const Default: Story = {
  render: () => (
    <div className="space-y-4">
      <PixelButton
        onClick={() =>
          toast("보상 획득", {
            description: "전리품 상자에서 희귀 아이템이 나왔습니다.",
          })
        }
      >
        Toast 띄우기
      </PixelButton>
      <Toaster />
    </div>
  ),
};
