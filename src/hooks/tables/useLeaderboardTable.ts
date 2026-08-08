import { useCallback } from "react";
import type { LeaderboardRow } from "../../types/db/leaderboardrow";
import { getLeaderboardTable } from "../../services/leaderboardservice";
import type { SheetId } from "../../constants/sheets";
import { useFetch } from "../useFetch";

export function useLeaderboardTable(sheetId: SheetId) {
    const fetcher = useCallback(() => getLeaderboardTable(sheetId), [sheetId]);
    const { data: leaderboardTable, loading, error } = useFetch<LeaderboardRow[]>(fetcher, []);
    return { leaderboardTable, loading, error };
}
