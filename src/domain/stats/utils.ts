import type { AggregateStats, MeanStats, Stats } from "../../types/leaderboard";
import type { PerformanceProfile } from "./types";

export function createEmptyStats(): Stats {
    return {
        kills: 0,
        deaths: 0,
        assists: 0,
        healing: 0,
        damage: 0,
    }
}

export function createEmptyAggregate(): AggregateStats {
    return {
        kills: 0,
        deaths: 0,
        assists: 0,
        healing: 0,
        damage: 0,
        count: 0,
    }
}

export function createProfile(mean: MeanStats, stdev: Stats): PerformanceProfile {
    return {
        kills: {
            mean: mean.kills,
            sd: stdev.kills,
        },
        deaths: {
            mean: mean.deaths,
            sd: stdev.deaths,
        },
        assists: {
            mean: mean.assists,
            sd: stdev.assists,
        },
        healing: {
            mean: mean.healing,
            sd: stdev.healing,
        },
        damage: {
            mean: mean.damage,
            sd: stdev.damage,
        },
    }
}

export function createEmptyProfile(): PerformanceProfile {
    return {
        kills: {
            mean: 0,
            sd: 1,
        },
        deaths: {
            mean: 0,
            sd: 1,
        },
        assists: {
            mean: 0,
            sd: 1,
        },
        healing: {
            mean: 0,
            sd: 1,
        },
        damage: {
            mean: 0,
            sd: 1,
        },
    }
}
