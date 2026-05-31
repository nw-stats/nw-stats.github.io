
import type { Character } from "../types/character";
import type { PlayerRow } from "../types/db/playerrow";
import type { Player } from "../types/player";
import { Qop } from "../types/queryparameter";
import { constructQuery } from "../utils/querybuilder";
import { convertInt, convertString } from "../utils/sheetconvert";
import { fetchTableFromGoogleSheets, type DataType } from "./googlesheets";

export async function getPlayersTable(sheetId: string): Promise<PlayerRow[]> {
    const query = constructQuery(['A', 'B', 'C', 'D', 'E', 'F',])
    let data: DataType[][] = []
    try {
        data = await fetchTableFromGoogleSheets(sheetId, 'players', query);
    } catch {
        return [];
    }

    const players: PlayerRow[] = [];
    for (const row of data) {
        const id = convertInt(row[0]);
        const name = convertString(row[1]);
        const discord = convertString(row[2]);
        const twitch = convertString(row[3]);
        const picture = convertString(row[4]);
        const youtube = convertString(row[5]);

        players.push({ id, name, discord, twitch, youtube, picture });
    }
    return players;
}

export function hydratePlayers(players: PlayerRow[], characters: Character[]): Player[] {
    const hydrated: Player[] = [];

    for (const player of players) {
        hydrated.push({
            name: player.name,
            discord: player.discord,
            alts: characters.filter((a: Character) => (a.player === player.name)),
        })
    }
    return hydrated;
}

export async function getPlayerRows(sheetId: string, playerNames: string[]): Promise<PlayerRow[]> {
    const query = constructQuery(
        ['A', 'B', 'C', 'D', 'E', 'F',],
        playerNames.map(v => ({ column: 'B', fn: Qop.Eq, value: v })),
    );
    try {
        const data = await fetchTableFromGoogleSheets(sheetId, 'players', query);
        return data.map(v => ({
            id: convertInt(v[0]),
            name: convertString(v[1]),
            discord: convertString(v[2]),
            twitch: convertString(v[3]),
            picture: convertString(v[4]),
            youtube: convertString(v[5]),
        }));
    } catch {
        return [];
    }
}
