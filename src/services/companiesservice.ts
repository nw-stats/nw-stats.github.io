import { constructQuery } from "../utils/querybuilder";
import { Qop } from "../types/queryparameter";
import { fetchTableFromGoogleSheets, type DataType } from "./googlesheets";

import type { Company } from "../types/company";
import { kSheetId } from "../constants/sheets";
import { kCompaniesColumns, kCompaniesTable } from "../mapping/companiesmap";
import { convertFaction, convertInt, convertString, convertStringArray } from "../utils/sheetconvert";

export async function getCompanies(companyNames?: string[]): Promise<Company[]> {
    const params = companyNames ? companyNames.map(v => ({ column: kCompaniesColumns.name, fn: Qop.Eq, value: v })) : undefined;
    const query = constructQuery([
        kCompaniesColumns.id,
        kCompaniesColumns.name,
        kCompaniesColumns.server,
        kCompaniesColumns.faction,
        kCompaniesColumns.governor,
        kCompaniesColumns.consuls,
        kCompaniesColumns.picture,
    ], params);
    let data: DataType[][] = [];
    try {
        data = await fetchTableFromGoogleSheets(kSheetId, 'companies', query);
    } catch (err) {
        return [];
    }

    let result = []
    for (const row of data) {
        result.push({
            id: convertInt(row[kCompaniesTable.id]),
            name: convertString(row[kCompaniesTable.name]),
            server: convertString(row[kCompaniesTable.server]),
            faction: convertFaction(row[kCompaniesTable.faction]),
            governor: convertString(row[kCompaniesTable.governor]),
            consuls: convertStringArray(row[kCompaniesTable.consuls]),
            picture: convertString(row[kCompaniesTable.picture]),
        });
    }
    return result;
}
