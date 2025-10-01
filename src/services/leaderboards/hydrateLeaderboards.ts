import type { LeaderboardRow } from "../../schemas/leaderboard";
import type { Company } from "../../types/company";
import type { LeaderboardEntry } from "../../types/leaderboard";
import { type Role } from "../../types/role";
import type { Rosters } from "../../types/roster";
import type { WarId } from "../../types/warId";
import { createCharacterLookupKey, createCharacterLookupMap } from "../../utils/characterLookup";
import { getCompanyOrStub } from "../companies/util";


function toRole(role: string): Role {
    return { name: role };
}

export function hydrateLeaderboards(
    rows: LeaderboardRow[],
    rosters: Map<WarId, Rosters>,
    companies: Company[],
): LeaderboardEntry[] {
    const companyMap = new Map(companies.map(c => [c.name, c]));
    const characterLookup = createCharacterLookupMap(rosters);

    return rows.map(row => {
        const company = companyMap.get(row.company) ?? getCompanyOrStub(row.company, companies);

        const key = createCharacterLookupKey(row.warId, row.company, row.character);
        const rosterChar = characterLookup.get(key);

        return {
            id: row.id,
            warid: row.warId,
            character: row.character,
            role: toRole(rosterChar?.role ?? ""),
            score: row.score,
            kills: row.kills,
            deaths: row.deaths,
            assists: row.assists,
            healing: row.healing,
            damage: row.damage,
            company,
            player: row.player ?? undefined,
        };
    });
}
