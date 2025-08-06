import { constructQuery } from "../utils/querybuilder";
import { Qop, type Ordering, type QueryParameter } from "../types/queryparameter";
import { fetchTableFromGoogleSheets, type DataType } from "./googlesheets";
import type { Character } from "../types/character";
import type { Role } from "../types/role";
import type { Faction } from "../types/faction";
import { kSheetId } from "../constants/sheets";

export async function getPlayer(playerName: string): Promise<Character | null> {
    const params = [{ column: 'B', fn: Qop.Eq, value: playerName }];
    const query = constructQuery(['A', 'B', 'C', 'D', 'E', 'F'], params);
    let data: DataType[][] = [];
    try {
        data = await fetchTableFromGoogleSheets(kSheetId, 'players', query);
    } catch (err) {
        return null;
    }

    if (data.length !== 0) {
        const row = data[0];
        const id = row[0] as number;
        const name = row[1] as string;
        const server = row[2] as string;
        const role = row[3] as Role;
        const faction = row[4] as Faction;
        const company = row[5] as string;
        return { id, name, server, role, faction, company };
    }

    return null;
}

export async function getPlayers(params?: QueryParameter[], order?: Ordering, limit?: number): Promise<Character[]> {
    const query = constructQuery(['A', 'B', 'C', 'D', 'E', 'F'], params, order, limit);
    const data = await fetchTableFromGoogleSheets(kSheetId, 'players', query);


    return data.map(row => ({
        id: row[0] as number,
        name: row[1] as string,
        server: row[2] as string,
        role: row[3] as Role,
        faction: row[4] as Faction,
        company: row[5] as string
    })).filter(v => v.name);
}
