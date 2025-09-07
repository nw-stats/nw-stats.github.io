import type { Company, CompanyName } from "./company";

export type RosterSplit = 'jonied' | 'split' | 'both';

export interface RosterCharacter {
    id: number;
    warId: number;
    company: Company;
    character: string;
    group: number;
    role?: string;
    qdps?: string;
    player?: string;
}

export type Group = RosterCharacter[];
export type Army = RosterCharacter[];
export type GroupNumber = number;
export type GroupKey = GroupNumber | string;
export type Rosters = Map<CompanyName, Army>;
