import { kSheetId } from "../constants/sheets";
import { type Leaderboard, type LeaderboardEntry, type StatTotals } from "../types/leaderboard";
import { type QueryParameter } from "../types/queryparameter";
import type { Role } from "../types/role";
import { constructQuery } from "../utils/querybuilder";
import { fetchTableFromGoogleSheets, type DataType } from "./googlesheets";


export function summarizeLeaderboard(leaderboard: Leaderboard): Map<string, StatTotals> {
    const summaries = new Map<string, StatTotals>();

    for (const entry of leaderboard.entries) {
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

export async function getLeaderboard(params: QueryParameter[]): Promise<Leaderboard | null> {
    const query = constructQuery(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'], params);
    let data: DataType[][] = [];
    try {
        data = await fetchTableFromGoogleSheets(kSheetId, 'leaderboards', query);
    } catch (err) {
        return null
    }

    if (data.length === 0) {
        return null
    }

    const entries: LeaderboardEntry[] = data.map((row: any[]) => ({
        warid: row[1] as number,
        role: '' as Role,
        character: row[2] as string,
        score: row[3] as number,
        kills: row[4] as number,
        deaths: row[5] as number,
        assists: row[6] as number,
        healing: row[7] as number,
        damage: row[8] as number,
        kpar: 0,
        company: row[9] as string,
    }));
    return { entries };
}
