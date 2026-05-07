import type { Character } from "./character";

export interface Player {
    name: string;
    discord: string;
    alts: Character[];
}
