import { useEffect, useState } from "react";
import type { StatTotals } from "../types/leaderboard";
import { normalize, summarize } from "../utils/leaderboard";

import { useWars } from "./base/useWars";
import { useLeaderboards } from "./base/useLeaderboards";

export function useCharacterStats(playerName: string) {
    const [summary, setSummary] = useState<StatTotals | null>(null);
    const [averages, setAverages] = useState<StatTotals | null>(null);
    const [error, setError] = useState<unknown>(null);

    const { loading: lbLoading, error: lbError, leaderboards } = useLeaderboards({ characters: [playerName] });
    const { loading: warsLoading, error: warsError, wars } = useWars({ ids: leaderboards.map(v => v.warid) });

    const loading = lbLoading || warsLoading;

    useEffect(() => {
        setError(lbError || warsError);
    }, [lbError, warsError]);

    useEffect(() => {
        if (!leaderboards || !wars.length) {
            setSummary(null);
            setAverages(null);
            return;
        }

        try {
            const validEntries = leaderboards.filter(v => wars.some(w => w.id === v.warid));
            const s = summarize(validEntries);
            const a = normalize(leaderboards, wars);

            setSummary(s);
            setAverages(a);
        } catch (err) {
            setError(err);
        }
    }, [leaderboards, wars]);

    return { error, loading, summary, averages };
}
