import type { Grouping } from "../../types/grouping";
import type { BaseOptions } from "../baseOptions";

export interface UseGroupsSummaryOptions extends BaseOptions {
    warIds?: number[];
    grouping?: Grouping;
}
