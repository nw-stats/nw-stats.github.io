import type { WarRow } from "../../schemas/war";
import type { Company } from "../../types/company";
import { validStatus } from "../../types/status";
import type { War } from "../../types/war";
import { toLiteral } from "../../utils/convert";
import { convertGoogleSheetsDateToDateTime } from "../../utils/date";
import { combineDateAndTime } from "../../utils/time";
import { getCompanyOrStub } from "../companies/util";


export function hydrateWars(warRows: WarRow[], companies: Company[]): War[] {
    return warRows.map(row => {
        const date = convertGoogleSheetsDateToDateTime(row.date);
        const time = convertGoogleSheetsDateToDateTime(row.time);

        const attacker = getCompanyOrStub(row.attacker, companies);
        const defender = getCompanyOrStub(row.defender, companies);

        return {
            id: row.id,
            date: combineDateAndTime(date, time, row.tz),
            server: row.server,
            territory: row.territory,
            attacker,
            defender,
            winner: row.winner || undefined,
            captureTimes: {
                pointA: row.pointA || undefined,
                pointB: row.pointB || undefined,
                pointC: row.pointC || undefined,
                fort: row.fort || undefined,
            },
            duration: row.duration || undefined,
            show: row.show,
            status: toLiteral(validStatus, row.status ?? '', 'not started'),
            hideRoles: row.hideRoles,
        };
    });
}
