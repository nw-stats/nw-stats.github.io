import { useQuery } from "@tanstack/react-query";
import { useHydratedCompanies } from "../companies/useHydratedCompanies";
import type { UseRosterOptions } from "./rosterOptions";
import { useRosterRows } from "./useRosterRows";
import { RETRY, STALE_TIME } from "../../constants/query";
import { getUniqueValuesOrUndefined } from "../../utils/getUniqueValuesOrUndefined";
import { hydrateRosters } from "../../services/rosters/hydrtateRosters";
import type { Rosters } from "../../types/roster";
import type { WarId } from "../../types/warId";
import { useMemo } from "react";

export function useHydratedRoster({ warIds, enabled }: UseRosterOptions) {
    const {
        data: rosterRows,
        isLoading: isLoadingRosters,
        isError: isErrorRosters,
        error: errorRosters,
    } = useRosterRows({ warIds, enabled });

    const companyNames = useMemo(
        () => getUniqueValuesOrUndefined(rosterRows?.map(r => r.company)),
        [rosterRows]
    );
    const {
        data: companies,
        isLoading: isLoadingCompanies,
        isError: isErrorCompanies,
        error: errorCompanies,
    } = useHydratedCompanies({
        companyNames,
        enabled: !!companyNames,
    });

    const {
        data: rosters,
        isLoading: isLoadingHydrated,
        isError: isErrorHydrated,
        error: errorHydrated,
    } = useQuery<Map<WarId, Rosters>, Error>({
        queryKey: ['hydratedRosters', warIds],
        queryFn: async () => {
            if (!rosterRows) throw new Error('Roster rows is empty');
            if (!companies) throw new Error('Companies is empty');
            return hydrateRosters(rosterRows, companies);
        },
        staleTime: STALE_TIME,
        retry: RETRY,
        enabled: (rosterRows
            && companies
            && rosterRows.length > 0
            && companies.length > 0),
    });

    return {
        data: rosters,
        isLoading: (isLoadingRosters || isLoadingCompanies || isLoadingHydrated),
        isError: (isErrorRosters || isErrorCompanies || isErrorHydrated),
        error: (errorRosters || errorCompanies || errorHydrated),
    }
}
