import { kSheetId } from "../constants/sheets";
import { type Leaderboard, type StatTotals } from "../types/leaderboard";
import { type QueryParameter } from "../types/queryparameter";
import type { Role } from "../types/role";
import { constructQuery } from "../utils/querybuilder";
import { convertInt, convertString } from "../utils/sheetconvert";
import { fetchTableFromGoogleSheets, type DataType } from "./googlesheets";


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

export async function getLeaderboard(params: QueryParameter[]): Promise<Leaderboard | undefined> {
    const query = constructQuery(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'], params);
    let data: DataType[][] = [];
    try {
        data = await fetchTableFromGoogleSheets(kSheetId, 'leaderboards', query);
    } catch (err) {
        return undefined;
    }

    if (data.length === 0) {
        return undefined;
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
        company: convertString(row[9]),
    }));
    return entries;
}
