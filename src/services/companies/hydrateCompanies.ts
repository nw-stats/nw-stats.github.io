import type { CompanyRow } from "../../schemas/comapny";
import type { Company } from "../../types/company";
import { toFaction } from "../../utils/factions";


export function hydrateCompanies(rows: CompanyRow[]): Company[] {
    return rows.map(row => ({
        id: row.id,
        name: row.name,
        server: row.server,
        faction: toFaction(row.faction),
        governor: row.governor ?? undefined,
        consuls: [],
        picture: undefined,
    }));
}
