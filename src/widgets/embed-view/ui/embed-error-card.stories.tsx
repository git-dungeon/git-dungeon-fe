import type { Meta, StoryObj } from "@storybook/react";
import { EmbedErrorCard } from "@/widgets/embed-view/ui/embed-error-card";

const meta: Meta<typeof EmbedErrorCard> = {
  title: "widgets/EmbedErrorCard",
  component: EmbedErrorCard,
};

export default meta;

type Story = StoryObj<typeof EmbedErrorCard>;

export const Default: Story = {
  args: {
    title: "임베드 오류",
    message: "SVG 렌더링에 실패했습니다.",
    size: "compact",
    language: "ko",
  },
};
