import type { PlayerRow } from "../../schemas/player";
import type { Character } from "../../types/character";
import type { Player } from "../../types/player";

export function hydratePlayers(
    rows: PlayerRow[],
    characters: Character[],
): Player[] {
    const chars = characters.filter(item => item.player === item.name);
    return rows.map(item => ({
        id: item.id,
        name: item.name,
        discord: item.discord ?? undefined,
        twitch: item.twitch ?? undefined,
        picture: item.picture ?? undefined,
        characters: chars.length > 0 ? chars : undefined,
    }))
}
