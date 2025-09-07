import { SHEET_ID, ROSTER_SHEET_NAME } from "../../constants/sheets";
import { RosterSchema, type RosterRow } from "../../schemas/roster";
import type { QueryParameter, Ordering } from "../googlesheets/queryparameter";
import { getService } from "../service";

export function getRosters(
    params?: QueryParameter<typeof RosterSchema>[],
    limit?: number,
    order?: Ordering<typeof RosterSchema>): Promise<RosterRow[]> {
    return getService(SHEET_ID, ROSTER_SHEET_NAME, RosterSchema, params, limit, order);
}
