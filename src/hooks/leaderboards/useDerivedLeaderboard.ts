import { useQuery } from "@tanstack/react-query";
import type { UseLeaderOptions } from "./leaderboardOptions";
import { useHydratedLeaderboard } from "./useHydratedLeaderboard";
import type { LeaderboardEntryKp } from "../../types/leaderboard";
import { RETRY, STALE_TIME } from "../../constants/query";
import { addKp } from "../../services/leaderboards/addKpar";
import { useLeaderboardSummary } from "./useLeaderboardSummary";
import { logging } from "../../utils/logging";

export function useDerivedLeaderboard({ warIds, characters, companyNames, enabled }: UseLeaderOptions = {}) {
    const {
        data: leaderboard,
    } = useHydratedLeaderboard({ warIds, characters, companyNames, enabled });

    const {
        data: summaries,
    } = useLeaderboardSummary({ warIds, characters, companyNames, enabled });
    logging('useDerivedLeaderboard:summaries', leaderboard);
    logging('useDerivedLeaderboard:summaries', summaries);
    return useQuery<LeaderboardEntryKp[], Error>({
        queryKey: ['derivedLeaderboard', warIds, characters, companyNames],
        queryFn: () => {
            if (!leaderboard) throw new Error('Leaderboard is empty');
            if (!summaries) throw new Error('Summaries is empty');

            return addKp(leaderboard, summaries);
        },
        staleTime: STALE_TIME,
        retry: RETRY,
        enabled: (
            !!leaderboard
            && leaderboard.length > 0
            && !!summaries
            && summaries.size > 0
        ),
    });
}
