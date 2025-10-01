import type { Grouping } from "../types/grouping";
import type { LeaderboardEntryKp } from "../types/leaderboard";
import { type Army, type GroupKey } from "../types/roster";

export function splitByGroup(
    roster: Army,
    leaderboard: LeaderboardEntryKp[],
    grouping: Grouping
): Map<GroupKey, LeaderboardEntryKp[]> {
    const groups = new Map<GroupKey, LeaderboardEntryKp[]>();

    const addToGroup = (key?: GroupKey, lbEntry?: LeaderboardEntryKp) => {
        if (!key || !lbEntry) return;
        const group = groups.get(key) ?? [];
        if (!groups.has(key)) groups.set(key, group);
        group.push(lbEntry);
    };

    for (const entry of roster) {
        const lbEntry = leaderboard.find(v => v.character === entry.character);
        if (!lbEntry) continue;

        switch (grouping) {
            case "joined":
                addToGroup(entry.group, lbEntry);
                break;
            case "split":
                addToGroup(entry.qdps, lbEntry);
                break;
            case "both":
                addToGroup(entry.group, lbEntry);
                addToGroup(entry.qdps, lbEntry);
                break;
        }
    }

    return groups;
}
