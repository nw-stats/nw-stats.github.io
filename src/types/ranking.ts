//import type { Company } from "./company";

import type { Faction } from "./faction";

export interface WinLoss {
    name: string;
    faction: Faction;
    defenseWins: number;
    defenseLoss: number;
    attackWins: number;
    attackLoss: number
}
