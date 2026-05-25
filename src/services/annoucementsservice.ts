import type { DateTime } from "luxon";
import type { AnnouncementsRow } from "../types/db/announcementrow";
import { fetchTableFromGoogleSheets } from "./googlesheets";
import { constructQuery } from "../utils/querybuilder";
import { convertString } from "../utils/sheetconvert";
import { convertFromGoogleSheetsDateString } from "../utils/time";
import { Qop } from "../types/queryparameter";

export async function getAnnoucements(
    expires: DateTime
): Promise<AnnouncementsRow[]> {
    const query = constructQuery(
        ['A', 'B', 'C'],
        [{ column: 'B', fn: Qop.Gte, value: expires }]
    )
    try {
        const data = await fetchTableFromGoogleSheets(
            '19YTRYkuOS5lFXiwxTPsmc8X-uXei37QDKZUiCaGsL1I',
            'announcements',
            query
        );
        return data.map(v => ({
            id: parseInt(v[0] as string),
            expires: convertFromGoogleSheetsDateString(v[1] as string),
            text: convertString(v[2]),
        }));
    } catch {
        return [];
    }
}
