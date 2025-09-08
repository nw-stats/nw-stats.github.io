import { useHydratedLeaderboard } from "./leaderboards/useHydratedLeaderboard";
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
    } = useHydratedLeaderboard({ warIds: [warId] });

    const WAR = war && war.length > 0 ? war[0] : undefined;
    return {
        data: {
            war: WAR,
            leaderboard
        },
        isLoading: isLoadingLeaderboards || isLoadingWars,
        isError: isErrorLeaderboards || isErrorWars,
    };
}
