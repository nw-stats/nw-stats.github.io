import type { RosterRow } from "../../schemas/roster";
import type { Company } from "../../types/company";
import { WarRosters } from "../../types/roster";
import type { WarId } from "../../types/warId";
import { getOrCreate } from "../../utils/map";
import { getCompanyOrStub } from "../companies/util";



export function hydrateRosters(
    rows: RosterRow[],
    companies: Company[]
): Map<WarId, WarRosters> {
    const rosters = new Map<WarId, WarRosters>;

    for (const row of rows) {
        const company = getCompanyOrStub(row.company, companies);
        const character = {
            id: row.id,
            warId: row.warId,
            company: company,
            character: row.character,
            group: row.group,
            role: row.role ?? undefined,
            qdps: row.qdps ?? undefined,
            player: row.player ?? undefined,
        }

        const warRoster = getOrCreate(rosters, row.warId, () => new WarRosters());
        const companyRoster = warRoster.getCompany(company.name);
        const group = companyRoster.getGroup(row.group)
        group.push(character);
    }
    return rosters;
}
