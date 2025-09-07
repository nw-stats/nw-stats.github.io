import type { CharacterRow } from "../../schemas/character";
import type { Company } from "../../types/company";
import type { Character } from "../../types/character";
import { toLiteral } from "../../utils/convert";
import { validFactions } from "../../types/faction";

export function hydrateCharacters(
    rows: CharacterRow[],
    companies: Company[],
): Character[] {
    return rows.map(row => {
        return {
            id: row.id,
            name: row.name,
            server: row.server,
            faction: toLiteral(validFactions, row.faction ?? "Gray", "Gray"),
            company: companies.find(c => c.name === row.company),
        }
    });
}
