import type { Character } from "./character";
import type { CharacterDetailsEntry, StatTotals } from "./leaderboard"


export interface CharacterDetails {
    character: Character;
    totals: StatTotals;
    normalized: StatTotals;
    history: CharacterDetailsEntry[];
}
