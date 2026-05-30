import { kSheetId } from "../constants/sheets";
import type { LeaderboardRow } from "../types/db/leaderboardrow";
import type { RosterRow } from "../types/db/rosterrow";
import type { WarRaw } from "../types/db/warraw";
import { type Leaderboard, type LeaderboardEntry, type StatTotals } from "../types/leaderboard";
import { type QueryParameter } from "../types/queryparameter";
import type { Role } from "../types/role";
import { constructQuery } from "../utils/querybuilder";
import { convertInt, convertString } from "../utils/sheetconvert";
import { fetchTableFromGoogleSheets, type DataType } from "./googlesheets";

export function summarizeLeaderboards(entires: LeaderboardEntry[]): Map<number, Map<string, StatTotals>> {
    const summaries = new Map<number, Map<string, StatTotals>>()

    for (const row of entires) {
        if (!summaries.has(row.warid)) {
            summaries.set(row.warid, new Map<string, StatTotals>());
        }
        const warSummary = summaries.get(row.warid);
        if (!warSummary) continue;

        if (!warSummary.has(row.company)) {
            warSummary.set(row.company, {
                name: row.company,
                score: 0,
                kills: 0,
                deaths: 0,
                assists: 0,
                healing: 0,
                damage: 0,
                count: 0,
                kpar: 0,
            });
        }
        const companySummary = warSummary.get(row.company);
        if (!companySummary) continue;

        companySummary.score += row.score;
        companySummary.kills += row.kills;
        companySummary.deaths += row.deaths;
        companySummary.assists += row.assists;
        companySummary.healing += row.healing;
        companySummary.damage += row.damage;
        companySummary.count += 1;
        companySummary.kpar += row.kpar;
    }

    return summaries;
}

export function summarizeLeaderboard(leaderboard: Leaderboard): Map<string, StatTotals> {
    const summaries = new Map<string, StatTotals>();

    for (const entry of leaderboard) {
        let summary = summaries.get(entry.company);
        if (!summary) {
            summary = {
                name: '',
                score: 0,
                kills: 0,
                deaths: 0,
                assists: 0,
                healing: 0,
                damage: 0,
                kpar: 0,
                count: 0,
            };
            summaries.set(entry.company, summary);
        }
        summary.name = entry.company;
        summary.score += entry.score;
        summary.kills += entry.kills;
        summary.deaths += entry.deaths;
        summary.assists += entry.assists;
        summary.healing += entry.healing;
        summary.damage += entry.damage;
        summary.count += 1;
    }

    return summaries;
}

export async function getLeaderboard(params: QueryParameter[]): Promise<Leaderboard | LeaderboardEntry[]> {
    const query = constructQuery(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'], params);
    let data: DataType[][] = [];
    try {
        data = await fetchTableFromGoogleSheets(kSheetId, 'leaderboards', query);
    } catch (err) {
        return [];
    }

    if (data.length === 0) {
        return [];
    }

    const entries: Leaderboard = data.map((row: any[]) => ({
        warid: convertInt(row[1]),
        roleAssignment: { role: '' as Role },
        character: convertString(row[2]),
        score: convertInt(row[3]),
        kills: convertInt(row[4]),
        deaths: convertInt(row[5]),
        assists: convertInt(row[6]),
        healing: convertInt(row[7]),
        damage: convertInt(row[8]),
        kpar: 0,
        efficiency: 0,
        aggression: 0,
        pressure: 0,
        company: convertString(row[9]),
    }));
    return entries;
}

export async function getLeaderboardTable(): Promise<LeaderboardRow[]> {
    const query = constructQuery(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']);
    let data: DataType[][] = []
    try {
        data = await fetchTableFromGoogleSheets(kSheetId, 'leaderboards', query);
    } catch {
        return [];
    }

    return data.map((row: DataType[]) => ({
        id: convertInt(row[0]),
        warid: convertInt(row[1]),
        character: convertString(row[2]),
        score: convertInt(row[3]),
        kills: convertInt(row[4]),
        deaths: convertInt(row[5]),
        assists: convertInt(row[6]),
        healing: convertInt(row[7]),
        damage: convertInt(row[8]),
    })) as LeaderboardRow[];
}

export function HydrateLeaderboardTable(
    leaderboard: LeaderboardRow[],
    rosters: Map<number, RosterRow[]>
): LeaderboardEntry[] {
    const entries: LeaderboardEntry[] = [];

    for (const leaderboardRow of leaderboard) {
        if (!rosters.has(leaderboardRow.warid)) {
            continue;
        }

        const roster = rosters.get(leaderboardRow.warid);
        if (!roster) continue;
        for (const rosterRow of roster) {
            if (rosterRow.character === leaderboardRow.character) {
                entries.push({
                    warid: leaderboardRow.warid,
                    character: leaderboardRow.character,
                    roleAssignment: { role: rosterRow.role as Role },
                    score: leaderboardRow.score,
                    kills: leaderboardRow.kills,
                    deaths: leaderboardRow.deaths,
                    assists: leaderboardRow.assists,
                    healing: leaderboardRow.healing,
                    damage: leaderboardRow.damage,
                    kpar: 0.,
                    efficiency: 0,
                    aggression: 0,
                    pressure: 0,
                    company: leaderboardRow.company,
                })
            }
        }
    }
    return entries;
}

export function normalizeLeaderboardEntries(
    leaderboard: LeaderboardEntry[],
    wars: WarRaw[]
): LeaderboardEntry[] {

    for (let entry of leaderboard) {
        const war = wars.find(v => v.id = entry.warid)
        if (!war) continue;
        entry.kills = entry.kills / war.duration * 1800;
        entry.deaths = entry.deaths / war.duration * 1800;
        entry.assists = entry.assists / war.duration * 1800;
        entry.healing = entry.healing / war.duration * 1800;
        entry.damage = entry.damage / war.duration * 1800;
    }
    return leaderboard;
}

export function groupByPlayer(
    leaderboardEntires: LeaderboardEntry[],
    characterPlayerMap: Map<string, string>
): Map<string, LeaderboardEntry[]> {
    const mapping = new Map<string, LeaderboardEntry[]>;

    for (const [character, player] of characterPlayerMap.entries()) {
        const entries = leaderboardEntires.filter(v => v.character == character);
        if (entries.length) {
            if (mapping.has(player)) {
                const prevEntires = mapping.get(player)!;
                const fullEntires = prevEntires?.concat(entries);
                mapping.set(player, fullEntires);
            } else {
                mapping.set(player, entries);
            }
        }
    }
    return mapping;
}
