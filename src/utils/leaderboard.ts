
import { type MapStat, type WarsSummary, type Leaderboard } from "../types/leaderboard"
import { kThirtyMinutesInSeconds } from "./constants";
import type { WarRosters } from "../types/roster";
import type { War } from "../types/war";
import type { CompositeStats } from "../types/stats";

export function normalizePlayerStats(toNormalize: Leaderboard, wars: War[]): CompositeStats {
    let score = 0;
    let kills = 0;
    let deaths = 0;
    let assists = 0;
    let healing = 0;
    let damage = 0;
    let count = 0;
    for (const entry of toNormalize) {
        const war = wars.find(v => v.id === entry.warid);
        if (!war) continue;

        const normalizeFactor = kThirtyMinutesInSeconds / (war.duration ?? 1800);
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
    return { score, kills, deaths, assists, healing, damage, count }
}



export function summarizeWars(toSummarize: War[], forCompany: string): WarsSummary {
    const summary: WarsSummary = {
        mostPlayed: { name: '', count: 0 },
        mostWin: { name: '', count: 0 },
        mostLoss: { name: '', count: 0 },
        defense: { win: 0, loss: 0, count: 0, rate: 0 },
        attack: { win: 0, loss: 0, count: 0, rate: 0 },
        overall: { win: 0, loss: 0, count: 0, rate: 0 },
    };

    const mapStats = new Map<string, MapStat>();

    for (const war of toSummarize) {
        let stat = mapStats.get(war.territory);
        if (!stat) {
            stat = { played: 0, win: 0 };
            mapStats.set(war.territory, stat);
        }

        stat.played += 1;

        const won = war.winner === forCompany;
        if (won) stat.win += 1;

        if (war.attacker.name === forCompany) {
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

    summary.attack.rate = summary.attack.count > 0 ? summary.attack.win / summary.attack.count : 0;
    summary.defense.rate = summary.defense.count > 0 ? summary.defense.win / summary.defense.count : 0;
    summary.overall.rate = summary.overall.count > 0 ? summary.overall.win / summary.overall.count : 0;

    return summary;
}


export function splitLeaderboards(leaderboard: Leaderboard): Map<string, Leaderboard> {
    const allLb = new Map<string, Leaderboard>();
    allLb.set("All", []);

    for (const entry of leaderboard) {
        allLb.get("All")!.push(entry);
        let split = allLb.get(entry.company.name);
        if (!split) {
            split = [];
            allLb.set(entry.company.name, split);
        }
        split.push(entry);
    }
    return allLb;
}

export function fillRoleAssignment(leaderboard: Leaderboard, rosters: WarRosters) {
    for (const entry of leaderboard) {
        const companyRoster = rosters.getCompany(entry.company.name);
        entry.role = { name: companyRoster.getCharacter(entry.character)?.role ?? '' };
    }
}

export function inferRoles(leaderboard: Leaderboard) {
    inferHealers(leaderboard);
}

function inferHealers(leaderboard: Leaderboard) {
    if (leaderboard.length === 0) return [];
    const healersFirst = leaderboard.sort((a, b) => b.healing - a.healing);

    // const minHealing = leaderboard.reduce((a, b) => a.healing < b.healing ? a : b);
    // const maxHealing = leaderboard.reduce((a, b) => a.healing > b.healing ? a : b);

    // Highest healing is probably aoe healer
    healersFirst[0].role = { name: "Healer AOE", inferred: true };
    healersFirst[1].role = { name: "Healer MB", inferred: true };
    healersFirst[2].role = { name: "Healer MB", inferred: true };
    healersFirst[3].role = { name: "Healer MB", inferred: true };
    healersFirst[4].role = { name: "Healer MB", inferred: true };
    healersFirst[5].role = { name: "Healer MB", inferred: true };
    healersFirst[6].role = { name: "Healer MB", inferred: true };
    healersFirst[7].role = { name: "Healer MB", inferred: true };
    healersFirst[8].role = { name: "Healer KS", inferred: true };
    healersFirst[9].role = { name: "Healer KS", inferred: true };
    healersFirst[10].role = { name: "Healer KS", inferred: true };

    return healersFirst;
}
