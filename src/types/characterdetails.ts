import type { CharacterProfile } from "../utils/characterProfile";
import type { CharacterDetailsEntry } from "./leaderboard"
import type { Stats } from "./stats";


export interface CharacterDetails {
    profile: CharacterProfile;
    totals: Stats;
    normalized: Stats;
    history: CharacterDetailsEntry[];
}
