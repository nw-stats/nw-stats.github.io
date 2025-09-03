import { SHEET_ID, WORLD_SHEET_NAME } from "../../constants/sheets";
import { WorldSchema, type WorldRow } from "../../schemas/world";
import type { Ordering, QueryParameter } from "../googlesheets/queryparameter";
import { getService } from "../service";

export async function getWorlds(
    params?: QueryParameter<typeof WorldSchema>[],
    limit?: number,
    order?: Ordering<typeof WorldSchema>
): Promise<WorldRow[]> {
    return getService(SHEET_ID, WORLD_SHEET_NAME, WorldSchema, params, limit, order);
}
