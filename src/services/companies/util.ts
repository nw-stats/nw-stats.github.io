import type { Company } from "../../types/company";
import { toFaction } from "../../utils/factions";
import { logging } from "../../utils/logging";

export function getCompanyOrStub(name: string, companyRows: Company[]): Company {
    const row = companyRows.find(item => item.name === name);

    if (!row) {
        logging(`Could not find company ${name}`);
        return {
            id: 0,
            name,
            server: "Unknown",
            faction: toFaction("Gray"),
            governor: "Scot Lane",      // fun default
            consuls: [],
            picture: undefined,
        };
    }

    return {
        id: row.id,
        name: row.name,
        server: row.server,
        faction: toFaction(row.faction),
        governor: row.governor ?? undefined,
        consuls: [],
        picture: undefined,
    };
}
