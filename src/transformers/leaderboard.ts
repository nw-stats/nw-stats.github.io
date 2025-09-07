import type { CompanyName } from "../types/company";
import type { DisplayLeaderboard, GroupLeaderboardEntry, Leaderboard } from "../types/leaderboard";
import type { Rosters } from "../types/roster";
import type { Stats } from "../types/stats";
import type { WarId } from "../types/warId";

export function summarizeLeaderboard(leaderboard: Leaderboard): Stats {
    return leaderboard.reduce(
        (acc, entry) => {
            acc.score += entry.score;
            acc.kills += entry.kills;
            acc.deaths += entry.deaths;
            acc.assists += entry.assists;
            acc.healing += entry.healing;
            acc.damage += entry.damage;
            return acc;
        },
        { score: 0, kills: 0, deaths: 0, assists: 0, healing: 0, damage: 0 }
    );
}

export function enrichLeaderboard(
    leaderboard: Leaderboard,
    roster: Map<WarId, Rosters>,
    summaires: Map<CompanyName, Stats>
): DisplayLeaderboard {

    return leaderboard.map(entry => {
        const kpar = (summaires.get(entry.company.name)
            ? (entry.kills + entry.assists) / summaires!.get(entry.company.name)!.kills
            : 0);
        const role = roster.get(entry.warid)
            ?.get(entry.company.name)
            ?.find(item => item.character === entry.character)
            ?.role ?? "";
        return {
            ...entry,
            role: { name: role },
            kpar,
        };
    });
}

export function enrichedGroupLeaderboard(
    leaderboard: DisplayLeaderboard,
    roster: Map<WarId, Rosters>,
): GroupLeaderboardEntry[] {
    return leaderboard.map(entry => {
        const char = roster
            ?.get(entry.warid)
            ?.get(entry.company.name)
            ?.find(item => item.character === entry.character);

        // ensure correct type here
        const role = (char?.role) ?? "dps";  // fallback
        const qdps = char?.qdps ? true : false;

        return {
            ...entry,
            role: { name: role }, // or just role if your type says so
            qdps,
        };
    });
}
