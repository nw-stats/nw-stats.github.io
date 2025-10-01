import { useQuery } from "@tanstack/react-query";
import { useHydratedRoster } from "../rosters/useHydratedRoster";
import type { UseGroupsSummaryOptions } from "./groupsOptions";
import { RETRY, STALE_TIME } from "../../constants/query";
import type { WarId } from "../../types/warId";
import type { CompanyName } from "../../types/company";
import type { LeaderboardEntryKp } from "../../types/leaderboard";
import { useDerivedLeaderboard } from "../leaderboards/useDerivedLeaderboard";
import type { GroupKey } from "../../types/roster";
import { splitByGroup } from "../../utils/groups";

export function useGroups({
    warIds,
    grouping = 'joined',
    enabled
}: UseGroupsSummaryOptions = {}) {
    const { data: rosters } = useHydratedRoster({ warIds, enabled });
    const { data: leaderboards } = useDerivedLeaderboard({ warIds, enabled });

    return useQuery<Map<WarId, Map<CompanyName, Map<GroupKey, LeaderboardEntryKp[]>>>, Error>({
        queryKey: ['groups', warIds, grouping],
        queryFn: () => {
            if (!rosters) throw new Error('Rosters are empty');
            if (!leaderboards) throw new Error('Leaderboards are empty');

            return new Map(
                [...rosters].map(([warId, rosterByCompany]) => [
                    warId,
                    new Map(
                        [...rosterByCompany].map(([company, army]) => [
                            company,
                            splitByGroup(army, leaderboards, grouping)
                        ])
                    )
                ])
            );
        },
        staleTime: STALE_TIME,
        retry: RETRY,
        enabled: Boolean(rosters && rosters.size > 0 && leaderboards && leaderboards.length > 0),
    });
}
