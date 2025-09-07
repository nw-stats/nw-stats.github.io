import type { DisplayLeaderboard } from "../types/leaderboard";
import { type GroupKey } from "../types/roster";
import { getOrCreate } from "../utils/map";
import type { RosterView } from "./rosterView";

export type GroupLeaderboardView = Map<GroupKey, DisplayLeaderboard>;

export function buildGroupLeaderboard(
    roster: RosterView,
    leaderboard: DisplayLeaderboard
): GroupLeaderboardView {
    const view = new Map<GroupKey, DisplayLeaderboard>();
    for (const [k, group] of roster) {
        const gV = getOrCreate(view, k, () => []);
        for (const character of group) {
            const found = leaderboard.find(entry => entry.character === character.character);
            if (found) {
                gV.push(found);
            }
        }
    }
    return view;
}
