import type { Faction } from "./faction";
export type CompanyName = string;
export interface Company {
    id: number,
    name: string;
    server: string;
    faction: Faction;
    governor?: string;
    consuls?: string[];
    picture?: string;
}
