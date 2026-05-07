import { kSheetId } from "../constants/sheets";
import type { Character } from "../types/character";
import type { PlayerRow } from "../types/db/playerrow";
import type { Player } from "../types/player";
import { constructQuery } from "../utils/querybuilder";
import { convertInt, convertString } from "../utils/sheetconvert";
import { fetchTableFromGoogleSheets, type DataType } from "./googlesheets";

export async function getPlayersTable(): Promise<PlayerRow[]> {
    const query = constructQuery(['A', 'B', 'C', 'D', 'E', 'F',])
    let data: DataType[][] = []
    try {
        data = await fetchTableFromGoogleSheets(kSheetId, 'players', query);
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
