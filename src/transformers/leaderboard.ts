import type { CompanyName } from "../types/company";
import type { DisplayLeaderboard, Leaderboard } from "../types/leaderboard";
import type { WarRosters } from "../types/roster";
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
} export function enrichLeaderboard(
    leaderboard: Leaderboard,
    roster: Map<WarId, WarRosters>,
    summaires: Map<CompanyName, Stats>): DisplayLeaderboard {

    return leaderboard.map(entry => {
        const kpar = (summaires.get(entry.company.name)
            ? (entry.kills + entry.assists) / summaires!.get(entry.company.name)!.kills
            : 0);
        return {
            ...entry,
            role: roster.get(entry.warid)
                ?.getCompany(entry.company.name)
                .getCharacter(entry.character)?.role ?? '',
            kpar,
        };
    });
}
