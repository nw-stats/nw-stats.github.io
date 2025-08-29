import { constructQuery } from "../utils/querybuilder";
import { combineDateAndTime, convertFromGoogleSheetsDateString } from "../utils/time";
import { fetchTableFromGoogleSheets } from "./googlesheets";
import { type Ordering, type QueryParameter } from "../types/queryparameter";
import { kSheetId } from "../constants/sheets";
import { kWarColumns, kWarTable } from "../mapping/warmap";
import { convertBoolean, convertInt, convertString, convertToStatus } from "../utils/sheetconvert";
import type { WarRaw } from "../types/rawtypes/warraw";

export async function getWars(params?: QueryParameter[], limit?: number, order?: Ordering): Promise<WarRaw[]> {
    const query = constructQuery([
        kWarColumns.id,
        kWarColumns.date,
        kWarColumns.time,
        kWarColumns.server,
        kWarColumns.territory,
        kWarColumns.attacker,
        kWarColumns.defender,
        kWarColumns.winnner,
        kWarColumns.pointA,
        kWarColumns.pointB,
        kWarColumns.pointC,
        kWarColumns.fort,
        kWarColumns.duration,
        kWarColumns.show,
        kWarColumns.status,
        kWarColumns.tz,
        kWarColumns.hideRoles,
    ], params, order, limit);
    const data = await fetchTableFromGoogleSheets(kSheetId, 'wars', query);
    const wars: WarRaw[] = [];
    for (const row of data) {
        const id = convertInt(row[kWarTable.id]);
        const date = convertFromGoogleSheetsDateString(row[kWarTable.date] as string) || new Date();
        const time = convertFromGoogleSheetsDateString(row[kWarTable.time] as string) || new Date();
        const tz = convertString(row[kWarTable.tz]);
        const dateTime = combineDateAndTime(date, time, tz);
        const server = convertString(row[kWarTable.server]);
        const map = convertString(row[kWarTable.territory]);
        const attacker = convertString(row[kWarTable.attacker]);
        const defender = convertString(row[kWarTable.defender]);
        const winner = convertString(row[kWarTable.winnner]);
        const captures = {
            pointA: convertInt(row[kWarTable.pointA]),
            pointB: convertInt(row[kWarTable.pointB]),
            pointC: convertInt(row[kWarTable.pointC]),
            fort: convertInt(row[kWarTable.fort]),
        };
        const status = convertToStatus(row[kWarTable.status]);
        const duration = convertInt(row[kWarTable.duration]);
        const hideRoles = convertBoolean(row[kWarTable.hideRoles]);
        wars.push({ id, date: dateTime, server, map, attacker, defender, winner, captures, duration, status, hideRoles });
    }
    return wars;
}
