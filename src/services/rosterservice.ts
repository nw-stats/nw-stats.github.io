import { kSheetId } from "../constants/sheets";
import { type QueryParameter } from "../types/queryparameter";
import type { Role } from "../types/role";
import type { Group, GroupKey, Roster } from "../types/roster";
import { constructQuery } from "../utils/querybuilder";
import { fetchTableFromGoogleSheets, type DataType } from "./googlesheets";


export async function getRosters(params: QueryParameter[]): Promise<Map<number, Map<string, Roster>>> {
    const query = constructQuery(['A', 'B', 'C', 'D', 'E', 'F', 'G'], params);
    let data: DataType[][] = [];

    try {
        data = await fetchTableFromGoogleSheets(kSheetId, 'rosters', query);
    } catch (err) {
        return new Map();
    }

    const allRosters = new Map<number, Map<string, Roster>>();
    for (const row of data) {
        //const id = row[0] as number;
        const war = row[1] as number;
        const company = row[2] as string;
        const player = row[3] as string;
        const role = row[4] as Role;
        const gk = row[5] as GroupKey;
        const qpds = row[6] as boolean;

        let warRoster = allRosters.get(war);
        if (!warRoster) {
            warRoster = new Map<string, Roster>();
            allRosters.set(war, warRoster);
        }

        let teamRoster = warRoster.get(company);
        if (!teamRoster) {
            teamRoster = { warid: war, groups: new Map<GroupKey, Group>() };
            warRoster.set(company, teamRoster);
        }

        let group = teamRoster.groups.get(gk);
        if (!group) {
            group = [];
            teamRoster.groups.set(gk, group);
        }

        group.push({ name: player, role, qpds });
    }

    return allRosters;
}
