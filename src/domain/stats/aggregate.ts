import type { AggregateStats, LeaderboardEntry } from "../../types/leaderboard";
import type { Role } from "../../types/role";
import { STAT_KEYS } from "./const";
import { createEmptyAggregate } from "./utils";


export function aggregateByRole(
    leaderboard: LeaderboardEntry[]
): Map<Role, AggregateStats> {
    const aggregates = new Map<Role, AggregateStats>;
    for (const entry of leaderboard) {
        const role = entry.roleAssignment.role;

        if (!aggregates.has(role)) {
            aggregates.set(role, createEmptyAggregate());
        }

        const aggregate = aggregates.get(role)!;

        for (const stat of STAT_KEYS) {
            aggregate[stat] += entry[stat];
        }

        aggregate.count++;
    }
    return aggregates;
}

export function agggregateEntires(
    leaderboard: LeaderboardEntry[]
): AggregateStats {
    const aggreated = createEmptyAggregate();
    for (const entry of leaderboard) {
        for (const stat of STAT_KEYS) {
            aggreated[stat] += entry[stat]
        }
        aggreated.count += 1;
    }
    return aggreated;
}
