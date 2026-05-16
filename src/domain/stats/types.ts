import type { Role } from "../../types/role";

export interface StatZScore {
    kills: number;
    deaths: number;
    assists: number;
    healing: number;
    damage: number;
}

export type RoleZScoreStates = Record<Role, StatZScore>;

export interface StatSummary {
    mean: number;
    sd: number;
}
export interface PerformanceProfile {
    kills: StatSummary;
    deaths: StatSummary;
    assists: StatSummary;
    healing: StatSummary;
    damage: StatSummary;
}

export type RoleStatProfile = Record<Role, PerformanceProfile>;
export type PlayersProfile = Record<string, RoleStatProfile>;
export type PlayersZScoreProfile = Record<string, Partial<Record<Role, StatZScore>>>;
// export type RoleStatProfile = Map<Role, PerformanceProfile>;
// export type PlayersProfile = Map<string, RoleStatProfile>;
