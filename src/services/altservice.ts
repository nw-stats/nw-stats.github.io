

import { Qop } from "../types/queryparameter";
import { constructQuery } from "../utils/querybuilder";
import { fetchTableFromGoogleSheets, type DataType } from "./googlesheets";

import { kCharacterColumns, kCharacterTable } from "../mapping/charactersmap";
import { convertString } from "../utils/sheetconvert";

export async function getAlts(sheetId: string, playerName: string): Promise<string[]> {
    const params = [{ column: kCharacterColumns.player, fn: Qop.Eq, value: playerName }];
    const query = constructQuery([
        kCharacterColumns.id,
        kCharacterColumns.character,
        kCharacterColumns.player,
    ], params);
    let data: DataType[][] = [];
    try {
        data = await fetchTableFromGoogleSheets(sheetId, 'characters', query);
    } catch {
        return [];
    }
    if (data.length === 0) {
        return [playerName];
    }
    return data.map(row => {
        return convertString(row[kCharacterTable.character]);
    });
}

export async function getPlayerNameFromAlt(sheetId: string, characterName: string): Promise<string | undefined> {
    const params = [{ column: kCharacterColumns.character, fn: Qop.Eq, value: characterName }];
    const query = constructQuery([kCharacterColumns.player], params);
    let data: DataType[][] = [];
    try {
        data = await fetchTableFromGoogleSheets(sheetId, 'characters', query);
    } catch {
        return undefined;
    }

    if (data.length > 0) {
        return convertString(data[0][0]);
    } else {
        return undefined;
    }
}
