import { useQuery } from "@tanstack/react-query";
import type { UseRosterOptions } from "./rosterOptions";
import type { RosterRow } from "../../schemas/roster";
import { RETRY, STALE_TIME } from "../../constants/query";
import { getRosters } from "../../services/rosters/rosterservice";
import { Qop } from "../../services/googlesheets/queryparameter";

function fetchRostersByWarIds(warIds: number[]): Promise<RosterRow[]> {
    return getRosters(warIds.map(item => ({
        field: 'warId',
        operator: Qop.Eq,
        value: item,
    })));
}

function fetchRostersAll(): Promise<RosterRow[]> {
    return getRosters();
}

export function useRosterRows({
    warIds,
    enabled,
}: UseRosterOptions) {
    return useQuery<RosterRow[], Error>({
        queryKey: ['rosterRow', warIds],
        queryFn: async () => {
            if (warIds) {
                return fetchRostersByWarIds(warIds);
            }
            return fetchRostersAll();
        },
        staleTime: STALE_TIME,
        retry: RETRY,
        enabled: enabled ?? true,
    })
}
