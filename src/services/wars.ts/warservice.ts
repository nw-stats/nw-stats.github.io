import { SHEET_ID, WAR_SHEET_NAME } from "../../constants/sheets";
import { WarSchema, type WarRow } from "../../schemas/war";
import { type QueryParameter, type Ordering, Qop } from "../googlesheets/queryparameter";
import { getService } from "../service";


export async function getWars(
    params?: QueryParameter<typeof WarSchema>[],
    limit?: number,
    order?: Ordering<typeof WarSchema>): Promise<WarRow[]> {
    if (!params) {
        params = []
    }
    if (params.findIndex(item => item.field === 'id') === -1) {
        params.push({ field: 'id', operator: Qop.Not, value: null });
    }
    const validated = await getService(SHEET_ID, WAR_SHEET_NAME, WarSchema, params, limit, order);
    return validated;
}
