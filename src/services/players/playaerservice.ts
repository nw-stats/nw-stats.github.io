import { PLAYER_SHEET_NAME, SHEET_ID } from "../../constants/sheets";
import { PlayerSchema, type PlayerRow } from "../../schemas/player";
import type { Ordering, QueryParameter } from "../googlesheets/queryparameter";
import { getService } from "../service";

export function getPlayers(
    params?: QueryParameter<typeof PlayerSchema>[],
    limit?: number,
    order?: Ordering<typeof PlayerSchema>): Promise<PlayerRow[]> {
    return getService(SHEET_ID, PLAYER_SHEET_NAME, PlayerSchema, params, limit, order);
}
