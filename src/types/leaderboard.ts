import type { DateTime } from "luxon";
import type { RoleAssignment } from "./role";
import type { Company } from "./company";
import type { GroupKey } from "./roster";

export interface Stats {
    kills: number;
    deaths: number;
    assists: number;
    healing: number;
    damage: number;
}
type Counted<T> = T & {
    count: number;
}
export type MeanStats = Counted<Stats>;
export type AggregateStats = Counted<Stats>;
export type DistributionStats = Stats;

export interface LeaderboardEntry extends Stats {
    warid: number;
    character: string;
    roleAssignment: RoleAssignment;
    score: number;
    kpar: number;
    pressure: number;
    efficiency: number;
    aggression: number;
    company: string;
}

export interface GroupsEntry extends LeaderboardEntry {
    qpds: boolean;
}
export interface CharacterDetailsEntry extends LeaderboardEntry {
    date: DateTime;
    attacker: Company;
    defender: Company;
    isWinner: boolean;
    duration: number;
}

export interface GroupStats {
    name: string;
    score: number;
    kills: number;
    deaths: number;
    assists: number;
    healing: number;
    damage: number;
    kpar: number;
}

export interface StatTotals {
    name: string;
    score: number;
    kills: number;
    deaths: number;
    assists: number;
    healing: number;
    damage: number;
    count: number;
    kpar: number;
}



export interface GroupPerformance {
    stats: GroupsEntry[];
}

export interface MapStat {
    played: number;
    win: number;
}

export interface WarsSummary {
    mostPlayed: { name: string, count: number };
    mostWin: { name: string, count: number };
    mostLoss: { name: string, count: number };
    defense: { win: number, loss: number, count: number, rate: number };
    attack: { win: number, loss: number, count: number, rate: number };
    overall: { win: number, loss: number, count: number, rate: number };
}

export type Leaderboard = LeaderboardEntry[];

export interface WarPressure {
    maxPressure: number;
    attackPressure: Map<GroupKey, number>;
    defendPressure: Map<GroupKey, number>;
}
