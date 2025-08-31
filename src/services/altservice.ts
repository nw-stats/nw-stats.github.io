

import { Qop } from "../types/queryparameter";
import { constructQuery } from "../utils/querybuilder";
import { fetchTableFromGoogleSheets, type DataType } from "./googlesheets";
import { kSheetId } from "../constants/sheets";
import { kCharacterColumns, kCharacterTable } from "../mapping/charactersmap";
import { convertString } from "../utils/sheetconvert";

export async function getAlts(playerName: string): Promise<string[]> {
    const params = [{ column: kCharacterColumns.player, fn: Qop.Eq, value: playerName }];
    const query = constructQuery([
        kCharacterColumns.id,
        kCharacterColumns.character,
        kCharacterColumns.player,
    ], params);
    let data: DataType[][] = [];
    try {
        data = await fetchTableFromGoogleSheets(kSheetId, 'characters', query);
    } catch (err) {
        return [];
    }

    if (data.length === 0) {
        return [playerName];
    }
    return data.map(row => {
        return convertString(row[kCharacterTable.character]);
    });
}

export async function getPlayerNameFromAlt(characterName: string): Promise<string | null> {
    const params = [{ column: kCharacterColumns.character, fn: Qop.Eq, value: characterName }];
    const query = constructQuery([kCharacterColumns.character], params);
    let data: DataType[][] = [];
    try {
        data = await fetchTableFromGoogleSheets(kSheetId, 'characters', query);
    } catch (err) {
        return null;
    }

    if (data.length > 0) {
        return convertString(data[0][0]);
    } else {
        return null;
    }
}
