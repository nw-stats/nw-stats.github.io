import type { Faction } from "./faction";

export interface Company {
    id: number,
    name: string;
    server: string;
    faction: Faction;
    governor: string;
    consuls: string[];
    picture: string;
}
