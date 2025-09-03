export interface Stats {
    score: number;
    kills: number;
    deaths: number;
    assists: number;
    healing: number;
    damage: number;
}
export interface CompositeStats extends Stats {
    count: number;
}
