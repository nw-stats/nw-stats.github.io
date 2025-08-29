import type { Status } from "../../types/status";

export interface UseWarsOptions {
    ids?: number[];
    companies?: string[];
    players?: string[];
    showHidden?: boolean;
    status?: Status[];
}
