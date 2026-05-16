import type { AggregateStats, MeanStats } from "../../types/leaderboard";
import type { Role } from "../../types/role";
import { STAT_KEYS } from "./const";
import { createEmptyAggregate } from "./utils";

export function computeMeans(
    totals: Map<Role, AggregateStats>
): Map<Role, MeanStats> {
    const means = new Map<Role, MeanStats>;
    for (const [role, agg] of totals) {
        let mean = means.get(role)
        if (!mean) {
            mean = createEmptyAggregate();
            means.set(role, mean);
        }
        for (const k of STAT_KEYS) {
            mean[k] = agg[k] / agg.count;
        }
        mean.count = agg.count;
    }
    return means;
}

export function computeMeansFromAggratated(
    aggreated: AggregateStats
): MeanStats {
    const mean = createEmptyAggregate();
    for (const stat of STAT_KEYS) {
        mean[stat] = aggreated[stat] / aggreated.count
    }
    mean.count = aggreated.count;
    return mean;
}
