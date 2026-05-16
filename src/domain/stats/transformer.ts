import { kRoles, type Role } from "../../types/role";
import type { PlayersZScoreProfile, RoleStatProfile } from "./types";

export interface RolePerformanceProfileRow {
    role: Role,
    killsMean: number;
    killsStdev: number;
    deathsMean: number;
    deathsStdev: number;
    assistsMean: number;
    assistsStdev: number;
    healingMean: number;
    healingStdev: number;
    damageMean: number;
    damageStdev: number;
}
export function transformForReactTables(
    performanceProfile: RoleStatProfile
): RolePerformanceProfileRow[] {
    return kRoles.map(role => {
        const p = performanceProfile[role];
        if (!p) return {
            role,
            killsMean: 0,
            killsStdev: 0,
            deathsMean: 0,
            deathsStdev: 0,
            assistsMean: 0,
            assistsStdev: 0,
            healingMean: 0,
            healingStdev: 0,
            damageMean: 0,
            damageStdev: 0,
        };
        return {
            role,
            killsMean: p.kills.mean,
            killsStdev: p.kills.sd,
            deathsMean: p.deaths.mean,
            deathsStdev: p.deaths.sd,
            assistsMean: p.assists.mean,
            assistsStdev: p.assists.sd,
            healingMean: p.healing.mean,
            healingStdev: p.healing.sd,
            damageMean: p.damage.mean,
            damageStdev: p.damage.sd,
        }
    }).filter(Boolean) as RolePerformanceProfileRow[];
}

export interface PlayersPerformanceReactTable {
    name: string;
    role: Role;
    kills: number;
    deaths: number;
    assists: number;
    healing: number;
    damage: number;
}
export function transformPlayerPerformanceForReactTables(
    playerPerformance: PlayersZScoreProfile
): PlayersPerformanceReactTable[] {

    const rows: PlayersPerformanceReactTable[] = [];

    for (const player of Object.keys(playerPerformance)) {
        const roles = playerPerformance[player];
        for (const role of Object.keys(roles) as Role[]) {
            const profile = roles[role];
            if (!profile) continue;

            const row: PlayersPerformanceReactTable = {
                name: player,
                role,
                kills: 0,
                deaths: 0,
                assists: 0,
                healing: 0,
                damage: 0,
            };


            row.kills = profile.kills;
            row.deaths = profile.deaths;
            row.assists = profile.assists;
            row.healing = profile.healing;
            row.damage = profile.damage;
            rows.push(row);
        }
    }

    return rows;
}
