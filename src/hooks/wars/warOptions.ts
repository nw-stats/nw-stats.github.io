import type { BaseOptions } from "../baseOptions";

export interface UseWarsOptions extends BaseOptions {
    warIds?: number[],
    companyNames?: string[],
}
