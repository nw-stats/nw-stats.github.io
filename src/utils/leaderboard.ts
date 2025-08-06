
import { type StatTotals, type LeaderboardEntry, type MapStat, type WarsSummary, type Leaderboard } from "../types/leaderboard"
import type { War } from "../types/war";
import { kThirtyMinutesInSeconds } from "./constants";

export function normalize(toNormalize: LeaderboardEntry[], wars: War[]): StatTotals {
    let name = '';
    let score = 0;
    let kills = 0;
    let deaths = 0;
    let assists = 0;
    let healing = 0;
    let damage = 0;
    let count = 0;
    let kpar = 0;
    for (const entry of toNormalize) {
        const war = wars.find(v => v.id === entry.warid);
        if (!war) continue;

        const normalizeFactor = kThirtyMinutesInSeconds / war.duration;
        name = entry.character;
        score += entry.score * normalizeFactor;
        kills += entry.kills * normalizeFactor;
        deaths += entry.deaths * normalizeFactor;
        assists += entry.assists * normalizeFactor;
        healing += entry.healing * normalizeFactor;
        damage += entry.damage * normalizeFactor;
        count += 1;
    }
    if (count > 0) {
        score /= count;
        kills /= count;
        deaths /= count;
        assists /= count;
        healing /= count;
        damage /= count;
    }
    return { name, score, kills, deaths, assists, healing, damage, count, kpar }
}
export function summarize(toSummarize: LeaderboardEntry[]): StatTotals {
    const summary = {
        name: '',
        score: 0,
        kills: 0,
        deaths: 0,
        assists: 0,
        healing: 0,
        damage: 0,
        kpar: 0,
        count: toSummarize.length,
    }

    for (const entry of toSummarize) {
        summary.score += entry.score;
        summary.kills += entry.kills;
        summary.deaths += entry.deaths;
        summary.assists += entry.assists;
        summary.healing += entry.healing;
        summary.damage += entry.damage;
        summary.kpar += entry.kpar;
    }
    if (toSummarize.length > 0) {
        summary.kpar /= toSummarize.length;
    }

    return summary;
}

export function summarizeWars(toSummarize: War[], forCompany: string): WarsSummary {
    const summary: WarsSummary = {
        mostPlayed: { name: '', count: 0 },
        mostWin: { name: '', count: 0 },
        mostLoss: { name: '', count: 0 },
        defense: { win: 0, loss: 0, count: 0 },
        attack: { win: 0, loss: 0, count: 0 },
        overall: { win: 0, loss: 0, count: 0 },
    };

    const mapStats = new Map<string, MapStat>();

    for (const war of toSummarize) {
        let stat = mapStats.get(war.map);
        if (!stat) {
            stat = { played: 0, win: 0 };
            mapStats.set(war.map, stat);
        }

        stat.played += 1;

        const won = war.winner === forCompany;
        if (won) stat.win += 1;

        if (war.attacker === forCompany) {
            won ? summary.attack.win++ : summary.attack.loss++;
        } else {
            won ? summary.defense.win++ : summary.defense.loss++;
        }
    }

    summary.attack.count = summary.attack.win + summary.attack.loss;
    summary.defense.count = summary.defense.win + summary.defense.loss;
    summary.overall.count = summary.attack.count + summary.defense.count;
    summary.overall.win = summary.attack.win + summary.defense.win;
    summary.overall.loss = summary.attack.loss + summary.defense.loss;

    // Track max stats
    let mostPlayed = -1, mostPlayedMap = '';
    let mostWins = -1, mostWinMap = '';
    let mostLosses = -1, mostLossMap = '';

    for (const [mapName, stat] of mapStats.entries()) {
        const losses = stat.played - stat.win;

        if (stat.played > mostPlayed) {
            mostPlayed = stat.played;
            mostPlayedMap = mapName;
        }

        if (stat.win > mostWins) {
            mostWins = stat.win;
            mostWinMap = mapName;
        }

        if (losses > mostLosses) {
            mostLosses = losses;
            mostLossMap = mapName;
        }
    }

    summary.mostPlayed = mostPlayed >= 0 ? { name: mostPlayedMap, count: mostPlayed } : { name: '', count: 0 };
    summary.mostWin = mostWins >= 0 ? { name: mostWinMap, count: mostWins } : { name: '', count: 0 };
    summary.mostLoss = mostLosses >= 0 ? { name: mostLossMap, count: mostLosses } : { name: '', count: 0 };

    return summary;
}

export function fillKpar(leaderboard: Leaderboard, summaries: Map<string, StatTotals>) {
    for (const entry of leaderboard.entries) {
        const company = entry.company;
        if (!summaries.has(company)) { continue; }
        const summary = summaries.get(company)!;
        const kpar = (entry.kills + entry.assists) / summary.kills;
        entry.kpar = kpar;
    }
}
