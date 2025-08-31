import type { Faction } from "./faction";

export interface Character {
    id: number,
    name: string;
    server: string;
    faction: Faction;
    company: string;
}
