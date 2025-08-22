import { useEffect, useMemo, useState } from "react";
import type { LeaderboardEntry } from "../../types/leaderboard";
import { getLeaderboard } from "../../services/leaderboardservice";
import { kLeaderboardColumns } from "../../mapping/leaderboardmap";
import { Qop, type QueryParameter } from "../../types/queryparameter";

export interface UseLeaderboardsOptions {
    warIds?: number[];
    characters?: string[];
    companies?: string[];
}

export function useLeaderboards(options?: UseLeaderboardsOptions) {
    const [leaderboards, setLeaderboards] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState<Boolean>(true);
    const [error, setError] = useState<any>(null);

    const warIdsKey = useMemo(() => (options?.warIds || []).sort().join(','), [options?.warIds]);
    const playersKey = useMemo(() => (options?.characters || []).sort().join(','), [options?.characters]);

    useEffect(() => {
        let cancelled = false;
        async function fetchAll() {
            setLoading(true);
            try {
                if (!options) {
                    setLeaderboards([]);
                    return;
                }

                let qp: QueryParameter[] = [];
                if (options.warIds) {
                    qp = options.warIds.map(v => ({
                        column: kLeaderboardColumns.character,
                        fn: Qop.Eq,
                        value: v
                    }));
                } else if (options.characters) {
                    qp = options.characters.map(v => ({
                        column: kLeaderboardColumns.character,
                        fn: Qop.Eq,
                        value: v,
                    }))
                } else if (options.companies) {
                    qp = options.companies.map(v => ({
                        column: kLeaderboardColumns.company,
                        fn: Qop.Eq,
                        value: v,
                    }));
                }
                const lb = await getLeaderboard(qp);
                if (!cancelled) return;
                setLeaderboards(lb || []);
            } catch (err) {
                setError(err)
            } finally {
                setLoading(false);
            }
        }
        fetchAll();
        return () => { cancelled = true };
    }, [warIdsKey, playersKey]);

    return { loading, error, leaderboards };
}
