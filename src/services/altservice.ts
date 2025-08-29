

import { Qop } from "../types/queryparameter";
import { constructQuery } from "../utils/querybuilder";
import { fetchTableFromGoogleSheets, type DataType } from "./googlesheets";
import { kSheetId } from "../constants/sheets";

export async function getAlts(playerName: string): Promise<string[]> {
    const params = [{ column: 'B', fn: Qop.Eq, value: playerName }];
    const query = constructQuery(['B', 'C',], params);
    let data: DataType[][] = [];
    try {
        data = await fetchTableFromGoogleSheets(kSheetId, 'characters', query);
    } catch (err) {
        return [];
    }
    
    if (data.length === 0) {
        return [playerName];
    }
    return data.map(row => row[1] as string);
}

export async function getPlayerNameFromAlt(characterName: string): Promise<string | null> {
    const params = [{ column: 'C', fn: Qop.Eq, value: characterName }];
    const query = constructQuery(['B'], params);
    let data: DataType[][] = [];
    try {
        data = await fetchTableFromGoogleSheets(kSheetId, 'characters', query);
    } catch (err) {
        return null;
    }

    if (data.length > 0) {
        return data[0][0] as string;
    } else {
        return null;
    }
}
