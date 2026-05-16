import type { DistributionStats, LeaderboardEntry, MeanStats, Stats } from "../../types/leaderboard";
import { createEmptyStats } from "./utils";
import { STAT_KEYS } from "./const";
import type { Role } from "../../types/role";

export function computeVariance(
    leaderboard: LeaderboardEntry[],
    means: Map<Role, MeanStats>
): Map<Role, DistributionStats> {
    const variances = new Map<Role, Stats>;
    for (const entry of leaderboard) {
        const role = entry.roleAssignment.role;
        const mean = means.get(role);
        if (!mean) {
            throw new Error(`${role} is not in Means`);
        }
        let variance = variances.get(role);
        if (!variance) {
            variance = createEmptyStats();
            variances.set(role, variance);
        }

        for (const k of STAT_KEYS) {
            const diff = entry[k] - mean[k];
            variance[k] += diff * diff;
        }
    }

    for (const [role, stats] of variances) {
        const count = means.get(role)!.count;

        for (const k of STAT_KEYS) {
            stats[k] /= count;
        }
    }
    return variances;
}

export function computeStandardDeviation(
    leaderboard: LeaderboardEntry[],
    means: Map<Role, MeanStats>
): Map<Role, DistributionStats> {
    const variances = computeVariance(leaderboard, means);
    for (const stats of variances.values()) {
        for (const k of STAT_KEYS) {
            stats[k] = Math.sqrt(stats[k])
        }
    }
    return variances;
}


export function computeStandardDeviationsForLeaderboard(
    leaderboard: LeaderboardEntry[],
    mean: MeanStats
): DistributionStats {
    const variance = createEmptyStats()
    for (const entry of leaderboard) {
        for (const stat of STAT_KEYS) {
            const diff = entry[stat] - mean[stat];
            variance[stat] += diff * diff;
        }
    }

    for (const stat of STAT_KEYS) {
        variance[stat] = Math.sqrt(variance[stat] / leaderboard.length);
    }

    return variance;
}
