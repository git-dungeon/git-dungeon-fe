import type { ProfileOverview } from "@/entities/profile/model/types";

export const DEFAULT_USER_ID = "user-123";

export const mockProfileOverview: ProfileOverview = {
  profile: {
    userId: DEFAULT_USER_ID,
    username: "mock-user",
    displayName: "Mocked Adventurer",
    email: "mocked.adventurer@example.com",
    avatarUrl: "https://avatars.githubusercontent.com/u/1?v=4",
    joinedAt: "2023-11-02T12:00:00.000Z",
  },
  connections: {
    github: {
      connected: true,
    },
  },
};
