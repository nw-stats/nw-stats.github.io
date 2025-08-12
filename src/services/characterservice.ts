import { constructQuery } from "../utils/querybuilder";
import { Qop, type Ordering, type QueryParameter } from "../types/queryparameter";
import { fetchTableFromGoogleSheets, type DataType } from "./googlesheets";
import type { Character } from "../types/character";
import { kSheetId } from "../constants/sheets";
import { kCharacterColumns, kCharacterSheetName, kCharacterTable } from "../mapping/charactersmap";
import { convertFaction, convertInt, convertRole, convertString } from "../utils/sheetconvert";

export async function getPlayer(playerName: string): Promise<Character | null> {
    const params = [{ column: kCharacterColumns.name, fn: Qop.Eq, value: playerName }];
    const query = constructQuery([
        kCharacterColumns.id,
        kCharacterColumns.name,
        kCharacterColumns.player,
        kCharacterColumns.role,
        kCharacterColumns.server,
        kCharacterColumns.faction,
        kCharacterColumns.company,
        kCharacterColumns.kind,
        kCharacterColumns.picture
    ], params);
    let data: DataType[][] = [];
    try {
        data = await fetchTableFromGoogleSheets(kSheetId, 'players', query);
    } catch (err) {
        return null;
    }

    if (data.length !== 0) {
        const row = data[0];
        const id = convertInt(row[kCharacterTable.id]);
        const name = convertString(row[kCharacterTable.name]);
        const server = convertString(row[kCharacterTable.server]);
        const role = convertRole(row[kCharacterTable.role]);
        const faction = convertFaction(row[kCharacterTable.faction]);
        const company = convertString(row[kCharacterTable.company]);
        return { id, name, server, role, faction, company };
    }

    return null;
}

export async function getPlayers(params?: QueryParameter[], order?: Ordering, limit?: number): Promise<Character[]> {
    const query = constructQuery([
        kCharacterColumns.id,
        kCharacterColumns.name,
        kCharacterColumns.player,
        kCharacterColumns.role,
        kCharacterColumns.server,
        kCharacterColumns.faction,
        kCharacterColumns.company,
        kCharacterColumns.kind,
        kCharacterColumns.picture
    ], params, order, limit);
    const data = await fetchTableFromGoogleSheets(kSheetId, kCharacterSheetName, query);


    return data.map(row => ({
        id: convertInt(row[kCharacterTable.id]),
        name: convertString(row[kCharacterTable.name]),
        server: convertString(row[kCharacterTable.server]),
        role: convertRole(row[kCharacterTable.role]),
        faction: convertFaction(row[kCharacterTable.faction]),
        company: convertString(row[kCharacterTable.company]),
    })).filter(v => v.name);
}
