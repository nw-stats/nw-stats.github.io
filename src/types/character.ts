import type { Faction } from "./faction";

export interface Character {
    name: string;
    player: string;
    server: string;
    faction: Faction;
    company: string;
}
