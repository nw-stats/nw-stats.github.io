import type { LeaderboardRow } from "./db/leaderboardrow";

export interface Ungrouped {
    character: string;
    leaderboard: LeaderboardRow
    warid: number;
}
