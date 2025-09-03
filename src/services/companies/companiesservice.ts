import { COMPANIES_SHEET_NAME, SHEET_ID } from "../../constants/sheets";
import { CompanySchema, type CompanyRow } from "../../schemas/comapny";
import type { Ordering, QueryParameter } from "../googlesheets/queryparameter";
import { getService } from "../service";

export async function getCompanies(
    params?: QueryParameter<typeof CompanySchema>[],
    limit?: number,
    order?: Ordering<typeof CompanySchema>,
): Promise<CompanyRow[]> {
    return getService(SHEET_ID, COMPANIES_SHEET_NAME, CompanySchema, params, limit, order);
}
