import { CHARACTER_SHEET_NAME, SHEET_ID } from "../../constants/sheets";
import { CharacterSchema, type CharacterRow } from "../../schemas/character";
import type { Ordering, QueryParameter } from "../googlesheets/queryparameter";
import { getService } from "../service";

export async function getCharacters(
    params?: QueryParameter<typeof CharacterSchema>[],
    limit?: number,
    order?: Ordering<typeof CharacterSchema>): Promise<CharacterRow[]> {
    return getService(SHEET_ID, CHARACTER_SHEET_NAME, CharacterSchema, params, limit, order);
}
