import { useEffect, useState } from "react";
import { type LeaderboardEntry, type StatTotals } from "../types/leaderboard";
import { getLeaderboard, summarizeLeaderboard } from "../services/leaderboardservice";
import { Qop } from "../types/queryparameter";

export function useLeaderboardsByCharacters(characters: string[]) {
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [summary, setSummary] = useState<Map<string, StatTotals>>(new Map());
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<any>(null);

    useEffect(() => {
        let cancelled = false;
        async function fetchAll() {
            try {
                setLoading(true);
                if (characters.length === 0) {
                    setLeaderboard([]);
                    return;
                }
                const qp = characters.map(v => ({ column: "C", fn: Qop.Eq, value: v }));
                const lb = await getLeaderboard(qp);

                if (!lb) throw new Error("Problem getting leaderboard.");

                const s = summarizeLeaderboard(lb);
                if (cancelled) return;

                setLeaderboard(lb.entries);
                setSummary(s);

            } catch (err) {
                if (!cancelled) setError(err);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        fetchAll();
        return () => { cancelled = true };
    }, [characters.sort().join(',')]);

    return { loading, error, leaderboard, summary };
}
