import { useEffect, useState } from "react";
import type { LeaderboardRow } from "../../types/db/leaderboardrow";
import { getLeaderboardTable } from "../../services/leaderboardservice";

export function useLeaderboardtable(sheetId: string) {
    const [leaderboardTable, setLeaderboardTable] = useState<LeaderboardRow[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<unknown>(null);

    useEffect(() => {
        let cancelled = false;
        async function fetchAll() {
            setLoading(true);
            try {
                const lb = await getLeaderboardTable(sheetId);
                if (cancelled) return;
                setLeaderboardTable(lb)
            } catch (err) {
                setError(err)
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        fetchAll();
        return () => { cancelled = true };
    }, []);
    return { loading, error, leaderboardTable };
}
