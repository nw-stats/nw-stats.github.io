import { useQuery } from "@tanstack/react-query";
import { hydrateLeaderboards } from "../../services/leaderboards/hydrateLeaderboards";
import { useHydratedCompanies } from "../companies/useHydratedCompanies";
import { useHydratedRoster } from "../rosters/useHydratedRoster";
import type { UseLeaderOptions } from "./leaderboardOptions";
import { useLeaderboardRows } from "./useLeaderboardRows";
import type { LeaderboardEntry } from "../../types/leaderboard";
import { RETRY, STALE_TIME } from "../../constants/query";
import { getUniqueValuesOrUndefined } from "../../utils/getUniqueValuesOrUndefined";
import { useMemo } from "react";
import { logging } from "../../utils/logging";

export function useHydratedLeaderboard({ warIds, characters, companyNames, enabled }: UseLeaderOptions = {}) {
    const {
        data: leaderboardRows,
        isLoading: isLoadingLeaderboards,
        isError: isErrorLeaderboards,
    } = useLeaderboardRows({
        warIds,
        characters,
        companyNames,
        enabled,
    });

    const companiesToFetch = useMemo(
        () => getUniqueValuesOrUndefined(leaderboardRows?.map(r => r.company)),
        [leaderboardRows]
    );

    const {
        data: companies,
        isLoading: isLoadingCompanies,
        isError: isErrorCompanies,
    } = useHydratedCompanies({
        companyNames: companiesToFetch,
        enabled: companiesToFetch && companiesToFetch.length > 0,
    });

    const warIdsToFetch = useMemo(
        () => getUniqueValuesOrUndefined(leaderboardRows?.map(r => r.warId)),
        [leaderboardRows]
    );

    const {
        data: rosters,
        isLoading: isLoadingRosters,
        isError: isErrorRosters,
    } = useHydratedRoster({
        warIds: warIdsToFetch,
        enabled: warIdsToFetch && warIdsToFetch.length > 0,
    });

    const {
        data: leaderboard,
        isError: isError,
        isLoading: isLoading,
    } = useQuery<LeaderboardEntry[], Error>({
        queryKey: ["hydratedLeaderboard", warIdsToFetch, companiesToFetch, characters],
        queryFn: async () => {
            if (!leaderboardRows) throw new Error("Leaderboard Rows is empty");
            if (!companies) throw new Error("Companies is empty");
            if (!rosters) throw new Error("Rosters is empty");
            return hydrateLeaderboards(
                leaderboardRows,
                rosters,
                companies,
            );
        },
        staleTime: STALE_TIME,
        retry: RETRY,
        enabled: (!!leaderboardRows
            && !!companies
            && !!rosters
            && leaderboardRows.length > 0
            && companies.length > 0
            && rosters.size > 0),
    })

    return {
        data: leaderboard,
        isLoading: (isLoading
            || isLoadingLeaderboards
            || isLoadingCompanies
            || isLoadingRosters),
        isError: (isError
            || isErrorLeaderboards
            || isErrorCompanies
            || isErrorRosters),
    }
}
