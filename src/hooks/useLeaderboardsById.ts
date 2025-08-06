import { useEffect, useState } from "react";
import { type Leaderboard, type StatTotals } from "../types/leaderboard";
import { getLeaderboard, summarizeLeaderboard } from "../services/leaderboardservice";
import { Qop } from "../types/queryparameter";
import { fillKpar } from "../utils/leaderboard";

export function useLeaderboardsByIds(warId: number) {
    const [leaderboard, setLeaderboard] = useState<Leaderboard | null>(null);
    const [summary, setSummary] = useState<Map<string, StatTotals>>(new Map());
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<any>(null);

    useEffect(() => {
        let cancelled = false;
        async function fetchAll() {
            try {
                setLoading(true);
                const qp = { column: "B", fn: Qop.Eq, value: warId };
                const lb = await getLeaderboard([qp]);
                if (cancelled) return;
                if (lb) {
                    const s = summarizeLeaderboard(lb);
                    setSummary(s);
                    fillKpar(lb, s);
                }
                setLeaderboard(lb);
            } catch (err) {
                if (!cancelled) setError(err);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        fetchAll();
        return () => { cancelled = true };
    }, [warId]);

    return { loading, error, leaderboard, summary };
}
