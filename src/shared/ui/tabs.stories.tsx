import type { Meta, StoryObj } from "@storybook/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";

const meta: Meta<typeof Tabs> = {
  title: "shared/Tabs",
  component: Tabs,
};

export default meta;

type Story = StoryObj<typeof Tabs>;

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="stats" className="w-[420px]">
      <TabsList>
        <TabsTrigger value="stats">Stats</TabsTrigger>
        <TabsTrigger value="loot">Loot</TabsTrigger>
        <TabsTrigger value="skills">Skills</TabsTrigger>
      </TabsList>
      <TabsContent value="stats" className="mt-4 text-sm">
        HP 120 / ATK 35 / DEF 18
      </TabsContent>
      <TabsContent value="loot" className="mt-4 text-sm">
        희귀 아이템 2개 획득
      </TabsContent>
      <TabsContent value="skills" className="mt-4 text-sm">
        대시 · 치명타 · 마법 방어
      </TabsContent>
    </Tabs>
  ),
};
