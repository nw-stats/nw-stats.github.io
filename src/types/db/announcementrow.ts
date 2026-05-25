import type { DateTime } from "luxon";

export interface AnnouncementsRow {
    id: number;
    expires: DateTime;
    text: string;
}
