import type { LeaderboardRow } from "../../schemas/leaderboard";
import type { Company } from "../../types/company";
import type { LeaderboardEntry } from "../../types/leaderboard";
import { type Role } from "../../types/role";
import { WarRosters, type RosterCharacter } from "../../types/roster";
import type { WarId } from "../../types/warId";
import { getCompanyOrStub } from "../companies/util";


function toRoleAssignment(role: string): Role {
    return { name: role };
}

export function hydrateLeaderboards(
    rows: LeaderboardRow[],
    rosters: Map<WarId, WarRosters>,
    companies: Company[]
): LeaderboardEntry[] {
    const companyMap = new Map(companies.map(c => [c.name, c]));

    const characterLookup = new Map<string, RosterCharacter>();
    for (const [warId, warRosters] of rosters.entries()) {
        for (const [companyName, roster] of warRosters.teams.entries()) {
            for (const group of roster.groups.values()) {
                for (const char of group) {
                    characterLookup.set(`${warId}|${companyName}|${char.character}`, char);
                }
            }
        }
    }

    return rows.map(row => {
        const company = companyMap.get(row.company) ?? getCompanyOrStub(row.company, companies);

        const key = `${row.warId}|${row.company}|${row.character}`;
        const rosterChar = characterLookup.get(key);

        return {
            id: row.id,
            warid: row.warId,
            character: row.character,
            roleAssignment: toRoleAssignment(rosterChar?.role ?? "unknown"),
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
