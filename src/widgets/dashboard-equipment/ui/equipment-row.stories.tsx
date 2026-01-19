import type { Meta, StoryObj } from "@storybook/react";
import { EquipmentRow } from "@/widgets/dashboard-equipment/ui/equipment-row";
import { sampleInventoryItems } from "@/mocks/fixtures/storybook";

const meta: Meta<typeof EquipmentRow> = {
  title: "widgets/EquipmentRow",
  component: EquipmentRow,
};

export default meta;

type Story = StoryObj<typeof EquipmentRow>;

const item = sampleInventoryItems[0];

export const Default: Story = {
  args: {
    label: "Weapon",
    item,
    placeholder: "장착된 무기가 없습니다",
    formatItem: (value) => value.name ?? value.code,
    formatModifier: (modifier) =>
      modifier.kind === "stat" ? `${modifier.stat} +${modifier.value}` : "효과",
  },
};
