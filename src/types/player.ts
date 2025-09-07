import type { Character } from "./character";

export interface Player {
    id: number;
    name: string;
    discord?: string;
    twitch?: string;
    picture?: string;
    characters: Character[];
}
