import { useQuery } from "@tanstack/react-query";
import type { UseLeaderOptions } from "./leaderboardOptions";
import { useLeaderboardRows } from "./useLeaderboardRows";
import type { Stats } from "../../types/stats";
import { RETRY, STALE_TIME } from "../../constants/query";
import { summarize } from "../../utils/stats";
import type { LeaderboardRow } from "../../schemas/leaderboard";
import { logging } from "../../utils/logging";

interface UseLeaderboardSummaryOptions extends UseLeaderOptions {
    groupBy?: (row: LeaderboardRow) => string;
}

export function useLeaderboardSummary({
    warIds,
    characters,
    companyNames,
    groupBy = (row) => row.company,
    enabled,
}: UseLeaderboardSummaryOptions = {}) {
    const { data: leaderboard } = useLeaderboardRows({ warIds, characters, companyNames, enabled });
    logging('useLeaderboardSummary:Leaderboard', leaderboard);
    return useQuery<Map<string, Stats>, Error>({
        queryKey: ['leaderboardSummary', warIds, characters, companyNames, groupBy.toString()],
        queryFn: () => {
            if (!leaderboard || leaderboard.length === 0) throw new Error("Leaderboard is empty");

            const grouped = new Map<string, LeaderboardRow[]>();
            for (const row of leaderboard) {
                const key = groupBy(row);
                if (!grouped.has(key)) grouped.set(key, []);
                grouped.get(key)!.push(row);
            }
            logging("useLeaderboardSummary: grouped", grouped);
            return new Map(
                [...grouped.entries()].map(([key, rows]) => [key, summarize(rows)])
            );
        },
        staleTime: STALE_TIME,
        retry: RETRY,
        enabled: !!leaderboard && leaderboard.length > 0,
    });
}
