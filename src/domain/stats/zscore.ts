import type { LeaderboardEntry } from "../../types/leaderboard";
import type { Role } from "../../types/role";
import { agggregateEntires, aggregateByRole } from "./aggregate";
import { STAT_KEYS } from "./const";
import { computeMeans, computeMeansFromAggratated } from "./mean";
import { computeStandardDeviation, computeStandardDeviationsForLeaderboard } from "./stdev";
import type { PerformanceProfile, PlayersProfile, RoleStatProfile, StatZScore } from "./types";
import { createProfile } from "./utils";

export function buildRolePerformanceProfile(
    leaderboard: LeaderboardEntry[]
): RoleStatProfile {
    const aggregates = aggregateByRole(leaderboard);
    const means = computeMeans(aggregates);
    const stdevs = computeStandardDeviation(leaderboard, means);

    const obj = {} as RoleStatProfile;
    for (const k of means.keys()) {
        const mean = means.get(k);
        const stdev = stdevs.get(k);

        if (!stdev || !mean) continue;

        obj[k] = createProfile(mean, stdev);
    }
    return obj
}

export function buildPerformanceProfile(
    leaderboard: LeaderboardEntry[]
): PerformanceProfile {
    const aggreated = agggregateEntires(leaderboard);
    const mean = computeMeansFromAggratated(aggreated);
    const stdevs = computeStandardDeviationsForLeaderboard(leaderboard, mean);

    const obj = {} as PerformanceProfile;
    for (const stat of STAT_KEYS) {
        obj[stat].mean = mean[stat];
        obj[stat].sd = stdevs[stat];
    }
    return obj;
}

export function buildPlayerPerformanceProfile(
    leaderboardsByPlayer: Map<string, LeaderboardEntry[]>
): PlayersProfile {
    const obj = {} as PlayersProfile;
    for (const [player, entries] of leaderboardsByPlayer.entries()) {
        const perf = buildRolePerformanceProfile(entries);
        obj[player] = perf;
    }
    return obj;
}

export function calculateZScore(
    playerProfile: PerformanceProfile,
    roleProfile: PerformanceProfile
): StatZScore {
    const obj = {} as StatZScore;
    for (const stat of STAT_KEYS) {
        obj[stat] = (playerProfile[stat].mean - roleProfile[stat].mean)
            / roleProfile[stat].sd;
    }
    return obj;
}

export function calculatePlayersZScore(
    playersProfile: PlayersProfile,
    rolesProfile: RoleStatProfile
): Record<string, Partial<Record<Role, StatZScore>>> {

    const result: Record<string, Partial<Record<Role, StatZScore>>> = {};

    for (const player of Object.keys(playersProfile)) {
        const playerRoles = playersProfile[player];
        result[player] = {};

        for (const role of Object.keys(playerRoles) as Role[]) {
            const playerRoleProfile = playerRoles[role];
            const globalRoleProfile = rolesProfile[role];

            if (!playerRoleProfile || !globalRoleProfile) continue;

            result[player][role] = calculateZScore(
                playerRoleProfile,
                globalRoleProfile
            );
        }
    }

    return result;
}
