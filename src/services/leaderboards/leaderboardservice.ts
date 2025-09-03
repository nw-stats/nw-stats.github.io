import { SHEET_ID, LEADERBOARD_SHEET_NAME } from "../../constants/sheets";
import { LeaderboardSchema, type LeaderboardRow } from "../../schemas/leaderboard";
import type { QueryParameter, Ordering } from "../googlesheets/queryparameter";
import { getService } from "../service";


export async function getLeaderboard(
    params?: QueryParameter<typeof LeaderboardSchema>[],
    limit?: number,
    order?: Ordering<typeof LeaderboardSchema>
): Promise<LeaderboardRow[]> {
    return getService(SHEET_ID, LEADERBOARD_SHEET_NAME, LeaderboardSchema, params, limit, order);
}
