import type { CharacterDetailsEntry, Leaderboard } from "../types/leaderboard";
import type { Character } from "../types/character";
import type { WarRosters } from "../types/roster";
import type { CharacterDetails } from "../types/characterdetails";
import { normalizePlayerStats } from "./leaderboard";
import type { CharacterProfile } from "./characterProfile";
import type { WarId } from "../types/warId";
import type { War } from "../types/war";
import { summarizeLeaderboard } from "../transformers/leaderboard";

export function createCharacterDetails(
    leaderboard: Leaderboard,
    rosters: Map<WarId, WarRosters>,
    wars: War[]
): CharacterDetailsEntry[] {
    const detailEntries: CharacterDetailsEntry[] = [];

    for (const war of wars) {
        const lbEntry = leaderboard.find(entry => entry.warid === war.id);
        if (!lbEntry) continue;

        const warRoster = rosters.get(war.id);
        if (!warRoster) continue;

        const companyRoster = warRoster.getCompany(lbEntry.company.name);
        if (!companyRoster) continue;

        const character = companyRoster.getCharacter(lbEntry.character);

        detailEntries.push({
            ...lbEntry,
            date: war.date,
            attacker: war.attacker,
            defender: war.defender,
            role: { name: character?.role ?? "" },
            isWinner: war.winner === lbEntry.company.name,
            duration: war.duration ?? 1800,
        });
    }

    return detailEntries;
}


export function createPlayerDetailsAndSummary(
    characters: Character[],
    leaderboardEntries: Leaderboard,
    rosters: Map<WarId, WarRosters>,
    wars: War[]): Map<string, CharacterDetails> {

    const details = new Map<string, CharacterDetails>();

    if (characters.length === 0) {
        return details;
    }
    let allHistory: CharacterDetailsEntry[] = []
    for (const character of characters) {
        const lb = leaderboardEntries.filter(v => v.character === character.name);
        const totals = summarizeLeaderboard(lb);
        const normalized = normalizePlayerStats(lb, wars);

        const history = createCharacterDetails(lb, rosters, wars);
        allHistory = allHistory.concat(history);
        details.set(character.name, { profile: createCharacterProfile(character), totals, normalized, history });

    }
    const allTotals = summarizeLeaderboard(leaderboardEntries);
    const allNormalized = normalizePlayerStats(leaderboardEntries, wars);
    details.set('All', { profile: combineCharacters(characters), totals: allTotals, normalized: allNormalized, history: allHistory });

    return details;
}

export function combineCharacters(characters: Character[]): CharacterProfile {
    const factionSet = new Set(characters.map(c => c.faction));
    const factions = Array.from(factionSet);
    const serverSet = new Set(characters.map(c => c.server).join(', '));
    const server = Array.from(serverSet);
    const companySet = new Set(characters.map(c => c.company));
    const companies = Array.from(companySet);

    return {
        name: characters.map(c => c.name).join(', '),
        servers: [...server],
        factions: factions,
        companies: companies,
    }
}

export function createCharacterProfile(character: Character): CharacterProfile {
    return {
        name: character.name,
        factions: [character.faction],
        servers: [character.server],
        companies: [character.company],
    }
}
