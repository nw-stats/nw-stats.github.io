import type { CharacterName } from "../types/character";
import type { Faction } from "../types/faction";


export interface CharacterProfile {
    name: CharacterName;
    servers: string[];
    factions: Faction[];
    companies: string[];
}
