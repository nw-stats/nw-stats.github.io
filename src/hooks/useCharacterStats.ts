import { useEffect, useState } from "react";
import { Qop } from "../types/queryparameter";
import type { StatTotals } from "../types/leaderboard";
import { normalize, summarize } from "../utils/leaderboard";
import { getLeaderboard } from "../services/leaderboardservice";
import { getWars } from "../services/wardbservice";

export function useCharacterStats(playerName: string) {
    const [summary, setSummary] = useState<StatTotals | null>(null);
    const [averages, setAverages] = useState<StatTotals | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<unknown>(null);

    useEffect(() => {
        let cancelled = false;
        async function fetchData() {
            try {
                setLoading(true);

                const qp = { column: 'C', fn: Qop.Eq, value: playerName };
                const lb = await getLeaderboard([qp]);

                const wqp = lb?.entries.map(v => ({ column: 'A', fn: Qop.Eq, value: v.warid })) || [];
                const w = await getWars([...wqp, { column: 'N', fn: Qop.Neq, value: true }]);

                const s = summarize(lb?.entries.filter(v => w.findIndex(w => w.id === v.warid) >= 0) || []);

                if (!w) {
                    setAverages(null);
                }
                const a = normalize(lb?.entries || [], w);

                if (cancelled) {
                    setSummary(null);
                    setAverages(null);
                    return;
                }
                setSummary(s);
                setAverages(a);

            } catch (err) {
                if (!cancelled) setError(err);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        fetchData();

        return () => {
            cancelled = true; // Prevent state update on unmounted component
        };
    }, [playerName]);

    return { error, loading, summary, averages };
}
