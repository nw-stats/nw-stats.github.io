
import { kRosterColumns } from "../mapping/rostermap";
import type { RosterRow } from "../types/db/rosterrow";
import { type QueryParameter } from "../types/queryparameter";
import type { Group, GroupKey, Roster } from "../types/roster";
import { constructQuery } from "../utils/querybuilder";
import { convertGroupKey, convertInt, convertRole, convertString } from "../utils/sheetconvert";
import { fetchTableFromGoogleSheets, type DataType } from "./googlesheets";


export async function getRosters(sheetId: string, params: QueryParameter[]): Promise<Map<number, Map<string, Roster>>> {
    const query = constructQuery([
        kRosterColumns.id,
        kRosterColumns.war,
        kRosterColumns.company,
        kRosterColumns.character,
        kRosterColumns.role,
        kRosterColumns.group,
        kRosterColumns.qpds
    ], params);
    let data: DataType[][] = [];

    try {
        data = await fetchTableFromGoogleSheets(sheetId, 'rosters', query);
    } catch (err) {
        return new Map();
    }

    const allRosters = new Map<number, Map<string, Roster>>();
    for (const row of data) {
        //const id = row[0] as number;
        const war = convertInt(row[1]);
        const company = convertString(row[2]);
        const player = convertString(row[3]);
        const role = convertRole(row[4]);
        const gk = convertGroupKey(row[5]);
        const qpds = convertString(row[6]);

        if (gk === '') continue; // ignore entries with empty groups

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

        group.push({ name: player, role, qpds: qpds });

        if (qpds) {
            const qdpsKey = qpds as GroupKey;
            let qpdsGroup = teamRoster.groups.get(qdpsKey);
            if (!qpdsGroup) {
                qpdsGroup = []
                teamRoster.groups.set(qdpsKey, qpdsGroup);
            }
            qpdsGroup.push({ name: player, role, qpds: qpds });
        }
    }

    return allRosters;
}

export async function getRosterTable(sheetId: string): Promise<RosterRow[]> {
    const query = constructQuery([
        kRosterColumns.id,
        kRosterColumns.war,
        kRosterColumns.company,
        kRosterColumns.character,
        kRosterColumns.role,
        kRosterColumns.group,
        kRosterColumns.qpds
    ]);
    let data: DataType[][] = [];
    try {
        data = await fetchTableFromGoogleSheets(sheetId, 'rosters', query);
    } catch {
        return [];
    }
    return data.map((row: DataType[]) => ({
        id: convertInt(row[0]),
        warid: convertInt(row[1]),
        company: convertString(row[2]),
        character: convertString(row[3]),
        role: convertString(row[4]),
        group: convertGroupKey(row[5]),
        qdps: convertString(row[6]),
    })) as RosterRow[];
}

export function GroupRosterByWarId(rosters: RosterRow[]): Map<number, RosterRow[]> {
    const grouped = new Map<number, RosterRow[]>;

    for (const row of rosters) {
        if (!grouped.has(row.warid)) {
            grouped.set(row.warid, []);
        }
        const g = grouped.get(row.warid);

        g!.push(row);
    }
    return grouped;
}
