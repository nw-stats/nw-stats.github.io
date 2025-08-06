import { useEffect, useState } from "react";
import { type Leaderboard, type StatTotals } from "../types/leaderboard";
import { getLeaderboard, summarizeLeaderboard } from "../services/leaderboardservice";
import { Qop } from "../types/queryparameter";

export function useLeaderboardsByCompany(name: string) {
    const [leaderboard, setLeaderboard] = useState<Leaderboard | null>(null);
    const [summary, setSummary] = useState<Map<string, StatTotals>>(new Map());
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<any>(null);

    useEffect(() => {
        let cancelled = false;
        async function fetchAll() {
            try {
                setLoading(true);
                const qp = { column: "J", fn: Qop.Eq, value: name };
                const lb = await getLeaderboard([qp]);
                if (!lb) throw new Error("Problem getting leaderboard.");

                const s = summarizeLeaderboard(lb);
                if (cancelled) return;

                setLeaderboard(lb);
                setSummary(s);

            } catch (err) {
                if (!cancelled) setError(err);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        fetchAll();
        return () => { cancelled = true };
    }, [name]);

    return { loading, error, leaderboard, summary };
}
