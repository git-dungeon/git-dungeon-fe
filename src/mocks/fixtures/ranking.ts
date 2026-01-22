import type { RankingList } from "@/entities/ranking/model/types";

export const rankingFixture: RankingList = {
  rankings: [
    {
      rank: 1,
      displayName: "PixelHero",
      avatarUrl: "https://avatars.githubusercontent.com/u/1?v=4",
      level: 25,
      maxFloor: 30,
    },
    {
      rank: 2,
      displayName: "CodeMage",
      avatarUrl: "https://avatars.githubusercontent.com/u/2?v=4",
      level: 24,
      maxFloor: 28,
    },
    {
      rank: 3,
      displayName: "ShadowByte",
      avatarUrl: null,
      level: 23,
      maxFloor: 27,
    },
  ],
  nextCursor: "MTI=",
};
