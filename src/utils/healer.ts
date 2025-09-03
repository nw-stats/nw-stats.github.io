
import { isHealer } from "../heuristics/role";
import type { HealerStats } from "../types/healerstats";
import type { GroupPerformance } from "../types/leaderboard";
import type { GroupKey } from "../types/roster";
import { isNumberGroup } from "./groups";

export function calculateHealerStats(groups: Map<string, Map<GroupKey, GroupPerformance>>): Map<string, HealerStats[]> {
    const stats = new Map<string, HealerStats[]>();

    for (const [company, allGroups] of groups) {
        let hstat: HealerStats[] = [];
        for (const [gk, g] of allGroups) {
            if (!isNumberGroup(gk)) continue;

            const healers = [];
            let qdpsDeaths = 0;
            let groupDeaths = 0;
            for (const entry of g.stats) {
                if (isHealer(entry.role.name)) {
                    healers.push({
                        character: entry.character,
                        group: entry.role.name === 'Healer AOE' ? 'AoE' : gk,
                        roleAssignment: entry.role,
                        healing: entry.healing,
                        qdpsDeaths: 0,
                        groupDeaths: 0,
                    })
                }

                if (entry.qpds) {
                    qdpsDeaths += entry.deaths;
                } else {
                    groupDeaths += entry.deaths
                }
            }

            for (let i = 0; i < healers.length; i++) {
                if (healers[i].roleAssignment.name !== 'Healer AOE') {
                    healers[i].groupDeaths = groupDeaths;
                    healers[i].qdpsDeaths = qdpsDeaths;
                }
            }

            hstat = hstat!.concat(healers);
        }

        stats.set(company, hstat);
    }
    return stats;
}
