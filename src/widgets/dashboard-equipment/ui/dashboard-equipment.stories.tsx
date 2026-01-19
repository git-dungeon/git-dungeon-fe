import type { Meta, StoryObj } from "@storybook/react";
import { DashboardEquipment } from "@/widgets/dashboard-equipment/ui/dashboard-equipment";
import { sampleInventoryItems } from "@/mocks/fixtures/storybook";

const meta: Meta<typeof DashboardEquipment> = {
  title: "widgets/DashboardEquipment",
  component: DashboardEquipment,
};

export default meta;

type Story = StoryObj<typeof DashboardEquipment>;

const helmet = sampleInventoryItems.find((item) => item.slot === "helmet");
const armor = sampleInventoryItems.find((item) => item.slot === "armor");
const weapon = sampleInventoryItems.find((item) => item.slot === "weapon");
const ring = sampleInventoryItems.find((item) => item.slot === "ring");

export const Default: Story = {
  args: {
    helmet,
    armor,
    weapon,
    ring,
  },
};
