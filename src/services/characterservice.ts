import { constructQuery } from "../utils/querybuilder";
import { Qop, type Ordering, type QueryParameter } from "../types/queryparameter";
import { fetchTableFromGoogleSheets, type DataType } from "./googlesheets";
import type { Character } from "../types/character";

import { kCharacterColumns, kCharacterSheetName, kCharacterTable } from "../mapping/charactersmap";
import { convertFaction, convertInt, convertString } from "../utils/sheetconvert";
import type { CharacterRow } from "../types/db/characterrow";
import type { Faction } from "../types/faction";

export async function getCharacter(sheetId: string, playerName: string): Promise<Character | null> {
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
        data = await fetchTableFromGoogleSheets(sheetId, 'characters', query);
    } catch (err) {
        return null;
    }

    if (data.length !== 0) {
        const row = data[0];
        const name = convertString(row[kCharacterTable.character]);
        const server = convertString(row[kCharacterTable.server]);
        const faction = convertFaction(row[kCharacterTable.faction]);
        const company = convertString(row[kCharacterTable.company]);
        return { name, server, faction, company, player: playerName };
    }

    return null;
}

export async function getCharacters(sheetId: string, params?: QueryParameter[], order?: Ordering, limit?: number): Promise<Character[]> {
    const query = constructQuery([
        kCharacterColumns.id,
        kCharacterColumns.character,
        kCharacterColumns.player,
        kCharacterColumns.server,
        kCharacterColumns.faction,
        kCharacterColumns.company,
        kCharacterColumns.picture
    ], params, order, limit);
    const data = await fetchTableFromGoogleSheets(sheetId, kCharacterSheetName, query);


    return data.map(row => ({
        name: convertString(row[kCharacterTable.character]),
        player: convertString(row[kCharacterTable.player]),
        server: convertString(row[kCharacterTable.server]),
        faction: convertFaction(row[kCharacterTable.faction]),
        company: convertString(row[kCharacterTable.company]),
    })).filter(v => v.name);
}

export async function getCharactersTable(sheetId: string): Promise<CharacterRow[]> {
    const query = constructQuery([
        kCharacterColumns.id,
        kCharacterColumns.character,
        kCharacterColumns.player,
        kCharacterColumns.server,
        kCharacterColumns.faction,
        kCharacterColumns.company,
        kCharacterColumns.picture
    ]);
    let data: DataType[][] = [];
    try {
        data = await fetchTableFromGoogleSheets(sheetId, kCharacterSheetName, query);
    }
    catch {
        return []
    }

    const characters: CharacterRow[] = [];

    for (const row of data) {
        const id = convertInt(row[kCharacterTable.id]);
        const name = convertString(row[kCharacterTable.character]);
        const player = convertString(row[kCharacterTable.player]);
        const server = convertString(row[kCharacterTable.server]);
        const faction = convertFaction(row[kCharacterTable.faction]);
        const company = convertString(row[kCharacterTable.company]);
        const picture = convertString(row[kCharacterTable.picture]);
        characters.push({
            id, name, player, server, faction, company, picture
        });
    }
    return characters;
}

export function createCharacterToPlayerMap(characters: CharacterRow[]): Map<string, string> {
    const mapping = new Map<string, string>();
    for (const row of characters) {
        if (mapping.has(row.name)) {
            console.error("0x000009aa", ": tell computer rofl ", row.name)
        }
        mapping.set(row.name, row.player);
    }
    return mapping;
}

export function hydrateCharacters(characters: CharacterRow[]): Character[] {
    return characters.map((a: CharacterRow) => ({
        name: a.name,
        player: a.player,
        server: a.server,
        faction: a.faction as Faction,
        company: a.company,
    }));
}
