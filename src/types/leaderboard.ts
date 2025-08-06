import type { Role } from "./role";

export interface LeaderboardEntry {
    warid: number;
    character: string;
    role: Role;
    score: number;
    kills: number;
    deaths: number;
    assists: number;
    healing: number;
    damage: number;
    kpar: number;
    company: string;
}

export interface GroupsEntry extends LeaderboardEntry {
}
export interface CharacterDetailsEntry extends LeaderboardEntry {
    date: Date;
    attacker: string;
    defender: string;
    isWinner: boolean;
    duration: number;
}

export interface Leaderboard {
    entries: LeaderboardEntry[];
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


export interface StatDiff extends StatTotals { }

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
    defense: { win: number, loss: number, count: number };
    attack: { win: number, loss: number, count: number };
    overall: { win: number, loss: number, count: number };
}
