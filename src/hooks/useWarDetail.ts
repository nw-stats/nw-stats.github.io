import { logging } from "../utils/logging";
import { useGroups } from "./groups/useGroups";
import { useDerivedLeaderboard } from "./leaderboards/useDerivedLeaderboard";
// import { useHydratedLeaderboard } from "./leaderboards/useHydratedLeaderboard";
import { useLeaderboardSummary } from "./leaderboards/useLeaderboardSummary";
import { useHydratedWars } from "./wars/useHydratedWars";

interface UseWarDetailOptions {
    warId: number;
}

export function useWarDetail({ warId }: UseWarDetailOptions) {

    const {
        data: war,
        isLoading: isLoadingWars,
        isError: isErrorWars,
    } = useHydratedWars({ warIds: [warId] });

    const {
        data: leaderboard,
        isLoading: isLoadingLeaderboards,
        isError: isErrorLeaderboards,
    } = useDerivedLeaderboard({ warIds: [warId] });

    const {
        data: summaries,
        isLoading: isLoadingSummaries,
        isError: isErrorSummaries,
    } = useLeaderboardSummary({ warIds: [warId] });

    const { data: groups,
        isLoading: isLoadingGroups,
        isError: isErrorGruops,
    } = useGroups({ warId, })
    const WAR = war && war.length > 0 ? war[0] : undefined;

    logging('useWarDetail:leaderboard', leaderboard);

    return {
        data: {
            war: WAR,
            summaries,
            leaderboard,
            groups,
        },
        isLoading: isLoadingLeaderboards || isLoadingWars || isLoadingSummaries,
        isError: isErrorLeaderboards || isErrorWars || isErrorSummaries,
    };
}
