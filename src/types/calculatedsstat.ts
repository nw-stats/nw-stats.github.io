import type { Statistics } from "./statistics";

export interface CalculatedStat {
    score: Statistics,
    kills: Statistics,
    deaths: Statistics,
    assists: Statistics,
    healing: Statistics,
    damage: Statistics
}
