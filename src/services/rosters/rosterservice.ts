import { ROSTER_SHEET_NAME, SHEET_ID } from "../constants/sheets";
import { RosterSchema, type RosterRow } from "../schemas/roster";
import type { Ordering, QueryParameter } from "./googlesheets/queryparameter";
import { getService } from "./service";


export function getRosters(
    params?: QueryParameter<typeof RosterSchema>[],
    limit?: number,
    order?: Ordering<typeof RosterSchema>): Promise<RosterRow[]> {
    return getService(SHEET_ID, ROSTER_SHEET_NAME, RosterSchema, params, limit, order);
}
