import type { Stats } from "../types/stats";

export function summarize(stats: Stats[]): Stats {
    const result = {
        score: 0,
        kills: 0,
        deaths: 0,
        assists: 0,
        healing: 0,
        damage: 0,
    }

    for (const entry of stats) {
        result.score += entry.score;
        result.kills += entry.kills;
        result.deaths += entry.deaths;
        result.healing += entry.healing;
        result.damage += entry.damage;
    }
    return result;
}
