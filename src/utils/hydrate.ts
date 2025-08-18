import { PlaceholderCompany } from "../constants/company";
import type { Company } from "../types/company";
import type { WarRaw } from "../types/rawtypes/warraw";
import type { War } from "../types/war";

export function hydrateWars(wars: WarRaw[], companies: Company[]): War[] {
    const hydradted: War[] = []
    for (const war of wars) {
        const attacker = companies.find(v => v.name === war.attacker) || PlaceholderCompany;
        const defender = companies.find(v => v.name === war.defender) || PlaceholderCompany;
        hydradted.push({ ...war, attacker, defender });
    }
    return hydradted;
}
