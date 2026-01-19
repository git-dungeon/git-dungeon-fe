import type { Meta, StoryObj } from "@storybook/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";

const meta: Meta<typeof Select> = {
  title: "shared/Select",
  component: Select,
};

export default meta;

type Story = StoryObj<typeof Select>;

export const Default: Story = {
  render: () => (
    <Select defaultValue="warrior">
      <SelectTrigger className="w-48">
        <SelectValue placeholder="클래스 선택" />
      </SelectTrigger>
      <SelectContent>
        <SelectLabel>Classes</SelectLabel>
        <SelectItem value="warrior">Warrior</SelectItem>
        <SelectItem value="mage">Mage</SelectItem>
        <SelectItem value="rogue">Rogue</SelectItem>
        <SelectSeparator />
        <SelectItem value="healer">Healer</SelectItem>
      </SelectContent>
    </Select>
  ),
};
