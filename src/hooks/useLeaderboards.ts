import { useEffect, useState } from "react";
import { type Leaderboard, type StatTotals } from "../types/leaderboard";
import { getLeaderboard, summarizeLeaderboard } from "../services/leaderboardservice";
import { Qop, type QueryParameter } from "../types/queryparameter";
import { fillKpar } from "../utils/leaderboard";
import { kLeaderboardColumns } from "../mapping/leaderboardmap";

export interface UseLeaderboardsOptions {
    id?: number;
    player?: string;
    company?: string;
}

export function useLeaderboards(options: UseLeaderboardsOptions) {
    const [leaderboard, setLeaderboard] = useState<Leaderboard | null>(null);
    const [summary, setSummary] = useState<Map<string, StatTotals>>(new Map());
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<any>(null);

    useEffect(() => {
        let cancelled = false;
        async function fetchAll() {
            try {
                setLoading(true);

                const query: QueryParameter[] = [];
                if (options.id) {
                    query.push({ column: kLeaderboardColumns.id, fn: Qop.Eq, value: options.id });
                }
                if (options.player) {
                    query.push({ column: kLeaderboardColumns.player, fn: Qop.Eq, value: options.player });
                }
                if (options.company) {
                    query.push({ column: kLeaderboardColumns.company, fn: Qop.Eq, value: options.company });
                }

                const lb = await getLeaderboard(query);
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
    }, [options.id, options.player, options.company]);

    return { loading, error, leaderboard, summary };
}
