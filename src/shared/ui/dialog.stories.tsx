import type { Meta, StoryObj } from "@storybook/react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/shared/ui/dialog";
import { PixelButton } from "@/shared/ui/pixel-button";

const meta: Meta<typeof Dialog> = {
  title: "shared/Dialog",
  component: Dialog,
};

export default meta;

type Story = StoryObj<typeof Dialog>;

export const Default: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <PixelButton>Open Dialog</PixelButton>
      </DialogTrigger>
      <DialogContent className="pixel-modal">
        <DialogHeader className="pixel-modal-header">
          <DialogTitle className="pixel-modal-title">알림</DialogTitle>
        </DialogHeader>
        <DialogDescription className="pixel-text-muted text-sm">
          던전 입장 전에 장비를 점검하세요.
        </DialogDescription>
        <DialogFooter className="pt-2">
          <DialogClose asChild>
            <PixelButton tone="danger">닫기</PixelButton>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};
