import { isAoeHealer, isHealer } from "../heuristics/role";
import type { HealerStats } from "../types/healerStats";
import type { GroupLeaderboardEntry } from "../types/leaderboard";
import type { GroupKey } from "../types/roster";
import { getOrCreate } from "../utils/map";

export type HealerSummary = Map<GroupKey, HealerStats[]>;

export function buildHealerSummaries(
    groupLeaderboards: Map<GroupKey, GroupLeaderboardEntry[]>
): HealerSummary {

    const healerSummary = new Map<GroupKey, HealerStats[]>();
    for (const [k, entries] of groupLeaderboards) {
        const healers = entries.filter(entry => isHealer(entry.role));
        const deaths = entries.reduce((acc, e) => {
            if (e.qdps) acc.qdps += e.deaths;
            else acc.group += e.deaths;
            return acc;
        }, { group: 0, qdps: 0 });


        for (const healer of healers) {
            const groupSummary = getOrCreate(healerSummary, k, () => []);
            if (isAoeHealer(healer.role)) {
                groupSummary.push({
                    role: healer.role,
                    healing: healer.healing,
                    selfDeaths: healer.deaths,
                    groupDeaths: 0,
                    qdpsDeaths: 0,
                });
            } else {
                groupSummary.push({
                    role: healer.role,
                    healing: healer.healing,
                    selfDeaths: healer.deaths,
                    groupDeaths: deaths.group,
                    qdpsDeaths: deaths.qdps,
                });
            }
        }
    }
    return healerSummary;
}
