import type { Decorator, Meta, StoryObj } from "@storybook/react";
import { useMemo, type ReactElement } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SettingsProfileSection } from "@/widgets/settings-profile/ui/settings-profile-section";
import { PROFILE_QUERY_KEY } from "@/entities/profile/model/profile-query";
import { sampleProfileOverview } from "@/mocks/fixtures/storybook";

const withProfileData: Decorator = (Story) => (
  <ProfileDataProvider Story={Story} />
);

function ProfileDataProvider({ Story }: { Story: () => ReactElement }) {
  const queryClient = useMemo(() => {
    const client = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          refetchOnWindowFocus: false,
          staleTime: 1000 * 60,
        },
      },
    });

    client.setQueryData(PROFILE_QUERY_KEY, sampleProfileOverview);

    return client;
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Story />
    </QueryClientProvider>
  );
}

const meta: Meta<typeof SettingsProfileSection> = {
  title: "widgets/SettingsProfileSection",
  component: SettingsProfileSection,
  decorators: [withProfileData],
};

export default meta;

type Story = StoryObj<typeof SettingsProfileSection>;

export const Default: Story = {};
