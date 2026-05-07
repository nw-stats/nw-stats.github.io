import type { GroupKey } from "../roster";

export interface RosterRow {
    id: number;
    warid: number;
    company: string;
    character: string;
    role: string;
    group: GroupKey;
    qdps: string;
}

export function rosterHasCharacter(roster: RosterRow[], characterName: string): boolean {
    return roster.some((v) => (v.character === characterName));
}
