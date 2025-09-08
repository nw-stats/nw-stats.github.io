import type { RosterRow } from "../../schemas/roster";
import type { Company, CompanyName } from "../../types/company";
import type { Army, Rosters } from "../../types/roster";
import type { WarId } from "../../types/warId";
import { getOrCreate } from "../../utils/map";
import { getCompanyOrStub } from "../companies/util";



export function hydrateRosters(
    rows: RosterRow[],
    companies: Company[]
): Map<WarId, Rosters> {
    const rosters = new Map<WarId, Rosters>;

    for (const row of rows) {
        const company = getCompanyOrStub(row.company, companies);
        const character = {
            id: row.id,
            warId: row.warId,
            company: company,
            character: row.character,
            group: row.group ?? undefined,
            role: row.role ?? undefined,
            qdps: row.qdps ?? undefined,
            player: row.player ?? undefined,
        }

        const warRoster = getOrCreate(rosters, row.warId, () => new Map<CompanyName, Army>());
        const companyArmy = getOrCreate(warRoster, row.company, () => []);
        companyArmy.push(character);
    }
    return rosters;
}
