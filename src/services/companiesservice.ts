import { constructQuery } from "../utils/querybuilder";
import { Qop } from "../types/queryparameter";
import { fetchTableFromGoogleSheets, type DataType } from "./googlesheets";
import type { Faction } from "../types/faction";
import type { Company } from "../types/company";
import { kSheetId } from "../constants/sheets";

export async function getCompanies(companyNames?: string[]): Promise<Company[]> {
    const params = companyNames ? companyNames.map(v => ({ column: 'B', fn: Qop.Eq, value: v })) : undefined;
    const query = constructQuery(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'], params);
    let data: DataType[][] = [];
    try {
        data = await fetchTableFromGoogleSheets(kSheetId, 'companies', query);
    } catch (err) {
        return [];
    }

    return data.map(row => ({
        id: row[0] as number,
        name: row[1] as string,
        shorthand: row[2] as string,
        server: row[3] as string,
        faction: row[4] as Faction,
        governor: row[5] as string,
        captains: row[6] ? (row[6] as string).split(',').map(v => v.trim()) : [],
        shotcaller: row[7] as string,
        tier: row[8] as string,
        icon: row[0] as string,
    }));
}
