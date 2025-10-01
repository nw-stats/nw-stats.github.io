import type { CompanyName } from "../../types/company";
import type { LeaderboardEntry, LeaderboardEntryKp } from "../../types/leaderboard";
import type { Stats } from "../../types/stats";

export function addKp(
    leaderboard: LeaderboardEntry[],
    summaries: Map<CompanyName, Stats>
): LeaderboardEntryKp[] {
    const result: LeaderboardEntryKp[] = [];

    for (const entry of leaderboard) {
        const summary = summaries.get(entry.company.name);

        const entryKp: LeaderboardEntryKp = {
            ...entry,
            kpar: summary && summary.kills > 0
                ? (entry.kills + entry.assists) / summary.kills
                : 0,
        };

        result.push(entryKp); // <-- add it to results
    }

    return result;
}
