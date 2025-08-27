
import type { HealerStats } from "../types/healerstats";
import type { GroupPerformance } from "../types/leaderboard";
import type { GroupKey } from "../types/roster";
import { isNumberGroup } from "./groups";
import { isHealer } from "./role";

export function calculateHealerStats(groups: Map<string, Map<GroupKey, GroupPerformance>>): Map<string, HealerStats[]> {
    const stats = new Map<string, HealerStats[]>();

    for (const [company, group] of groups) {
        let hstats = stats.get(company)
        if (!hstats) {
            hstats = [];
            stats.set(company, hstats);
        }

        for (const [gk, stats] of group) {
            if (!isNumberGroup(gk)) continue;

            let groupDeaths = 0;
            let qdpsDeaths = 0;
            for (const entry of stats.stats) {
                if (isHealer(entry.role)) {
                    hstats.push({
                        character: entry.character,
                        group: gk,
                        healing: entry.healing,
                        groupDeaths: 0,
                        qdpsDeaths: 0
                    });
                }

                groupDeaths += !entry.qpds ? entry.deaths : 0;
                qdpsDeaths += entry.qpds ? entry.deaths : 0;
            }
            for (let i = 0; i < hstats.length; i++) {
                hstats[i].groupDeaths = groupDeaths;
                hstats[i].qdpsDeaths = qdpsDeaths;
            }
        }
    }
    return stats;
}
