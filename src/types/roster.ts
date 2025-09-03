import { getOrCreate } from "../utils/map";
import type { CharacterName } from "./character";
import type { Company, CompanyName } from "./company";

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
export type GroupKey = number;

export class Roster {
    groups = new Map<GroupKey, Group>();
    characters = new Map<CharacterName, RosterCharacter>();
    getGroup(key: GroupKey) {
        return getOrCreate(this.groups, key, () => []);
    }

    addCharacter(toGroup: GroupKey, character: RosterCharacter) {
        this.getGroup(toGroup).push(character);
        this.characters.set(character.character, character);
    }

    getCharacter(name: CharacterName): RosterCharacter | undefined {
        return this.characters.get(name) ?? undefined;
    }
}

export class WarRosters {
    teams = new Map<CompanyName, Roster>();

    getCompany(name: CompanyName) {
        return getOrCreate(this.teams, name, () => new Roster());
    }
}
