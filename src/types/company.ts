import type { Faction } from "./faction";

export interface Company {
    id: number,
    name: string;
    shorthand: string;
    server: string;
    faction: Faction;
    governor: string;
    captains: string[]
    shotcaller: string;
    tier: string;
    icon: string;
}
