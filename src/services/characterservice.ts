import { constructQuery } from "../utils/querybuilder";
import { Qop, type Ordering, type QueryParameter } from "../types/queryparameter";
import { fetchTableFromGoogleSheets, type DataType } from "./googlesheets";
import type { Character } from "../types/character";
import { kSheetId } from "../constants/sheets";
import { kCharacterColumns, kCharacterSheetName, kCharacterTable } from "../mapping/charactersmap";
import { convertFaction, convertInt, convertString } from "../utils/sheetconvert";

export async function getCharacter(playerName: string): Promise<Character | null> {
    const params = [{ column: kCharacterColumns.character, fn: Qop.Eq, value: playerName }];
    const query = constructQuery([
        kCharacterColumns.id,
        kCharacterColumns.character,
        kCharacterColumns.player,
        kCharacterColumns.server,
        kCharacterColumns.faction,
        kCharacterColumns.company,
        kCharacterColumns.picture
    ], params);
    let data: DataType[][] = [];
    try {
        data = await fetchTableFromGoogleSheets(kSheetId, 'characters', query);
    } catch (err) {
        return null;
    }

    if (data.length !== 0) {
        const row = data[0];
        const id = convertInt(row[kCharacterTable.id]);
        const name = convertString(row[kCharacterTable.character]);
        const server = convertString(row[kCharacterTable.server]);
        const faction = convertFaction(row[kCharacterTable.faction]);
        const company = convertString(row[kCharacterTable.company]);
        return { id, name, server, faction, company };
    }

    return null;
}

export async function getCharacters(params?: QueryParameter[], order?: Ordering, limit?: number): Promise<Character[]> {
    const query = constructQuery([
        kCharacterColumns.id,
        kCharacterColumns.character,
        kCharacterColumns.player,
        kCharacterColumns.server,
        kCharacterColumns.faction,
        kCharacterColumns.company,
        kCharacterColumns.picture
    ], params, order, limit);
    const data = await fetchTableFromGoogleSheets(kSheetId, kCharacterSheetName, query);


    return data.map(row => ({
        id: convertInt(row[kCharacterTable.id]),
        name: convertString(row[kCharacterTable.character]),
        server: convertString(row[kCharacterTable.server]),
        faction: convertFaction(row[kCharacterTable.faction]),
        company: convertString(row[kCharacterTable.company]),
    })).filter(v => v.name);
}
