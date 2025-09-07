import type { Company } from "./company";
import type { Faction } from "./faction";
export type CharacterName = string;

export interface Character {
    id: number,
    name: CharacterName;
    server: string;
    faction: Faction;
    company?: Company;
}
