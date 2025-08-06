import type { WarPlayer } from "./warplayer";

export type GroupKey = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 'Weak' | 'Strong';


export type Group = WarPlayer[];

export interface Roster {
    warid: number;
    groups: Map<GroupKey, Group>;
}
