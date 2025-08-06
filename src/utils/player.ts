import type { CharacterDetailsEntry, LeaderboardEntry } from "../types/leaderboard";
import type { Character } from "../types/character";
import type { Role } from "../types/role";
import type { Roster } from "../types/roster";
import type { War } from "../types/war";
import type { CharacterDetails } from "../types/characterdetails";
import { normalize, summarize } from "./leaderboard";

export function createCharacterDetails(
    leaderboard: LeaderboardEntry[],
    rosters: Map<number, Map<string, Roster>>,
    wars: War[]
): CharacterDetailsEntry[] {


    var detailEntires: CharacterDetailsEntry[] = []

    for (const war of wars) {
        const lbEntry = leaderboard.find(v => v.warid === war.id);
        if (!lbEntry) {
            continue
        };
        const warRoster = rosters.get(war.id);
        if (!warRoster) {

            continue
        };
        const companyRoster = warRoster.get(lbEntry.company);
        if (!companyRoster) {
            continue
        };

        const attacker = war.attacker;
        const defender = war.defender;
        const isWinner = war.winner === lbEntry.company;
        const date = war.date;
        const duration = war.duration;
        let role: Role = '';
        for (const [_, group] of companyRoster.groups) {
            const wp = group.find(v => v.name === lbEntry.character);
            if (wp) {
                role = wp.role;
                break;
            }
        }

        detailEntires.push({ ...lbEntry, date, attacker, defender, role, isWinner, duration });
    }

    return detailEntires;
}


export function createPlayerDetailsAndSummary(
    characters: Character[],
    leaderboardEntries: LeaderboardEntry[],
    rosters: Map<number, Map<string, Roster>>,
    wars: War[]): Map<string, CharacterDetails> {

    const details = new Map<string, CharacterDetails>();

    if (characters.length === 0) {
        return details;
    }

    let allHistory: CharacterDetailsEntry[] = []
    for (const character of characters) {
        const lb = leaderboardEntries.filter(v => v.character === character.name);
        const totals = summarize(lb);
        const normalized = normalize(lb, wars);
        const history = createCharacterDetails(lb, rosters, wars);
        allHistory = allHistory.concat(history);
        details.set(character.name, { character, totals, normalized, history });
    }


    const allTotals = summarize(leaderboardEntries);
    const allNormalized = normalize(leaderboardEntries, wars);
    details.set('All', { character: combineCharacters(characters), totals: allTotals, normalized: allNormalized, history: allHistory });

    return details;
}

export function combineCharacters(characters: Character[]): Character {
    const roleSet = new Set(characters.map(c => c.role));
    const role = roleSet.size === 1 ? [...roleSet.values()][0] : 'Many';
    const factionSet = new Set(characters.map(c => c.faction));
    const faction = factionSet.size === 1 ? characters[0].faction : 'Many';
    const serverSet = new Set(characters.map(c => c.server).join(', '));
    const server = [...serverSet].join(', ');
    const companySet = new Set(characters.map(c => c.company));
    const companies = [...companySet].join(', ');

    return {
        id: -1,
        name: characters.map(c => c.name).join(', '),
        server: server,
        role: role,
        faction: faction,
        company: companies,
    }
}
