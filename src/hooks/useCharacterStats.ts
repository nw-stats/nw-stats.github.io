import { useEffect, useState } from "react";
import type { StatTotals } from "../types/leaderboard";
import { normalize, summarize } from "../utils/leaderboard";

import { useWars } from "./useWars";
import { useLeaderboards } from "./useLeaderboards";

export function useCharacterStats(playerName: string) {
    const [summary, setSummary] = useState<StatTotals | null>(null);
    const [averages, setAverages] = useState<StatTotals | null>(null);
    const [error, setError] = useState<unknown>(null);

    const { loading: lbLoading, error: lbError, leaderboard } = useLeaderboards({ player: playerName });
    const { loading: warsLoading, error: warsError, wars } = useWars({ ids: leaderboard?.entries.map(v => v.warid) });

    const loading = lbLoading || warsLoading;

    useEffect(() => {
        setError(lbError || warsError);
    }, [lbError, warsError]);

    useEffect(() => {
        if (!leaderboard || !wars.length) {
            setSummary(null);
            setAverages(null);
            return;
        }

        try {
            const validEntries = leaderboard.entries.filter(v => wars.some(w => w.id === v.warid));
            const s = summarize(validEntries);
            const a = normalize(leaderboard.entries, wars);

            setSummary(s);
            setAverages(a);
        } catch (err) {
            setError(err);
        }
    }, [leaderboard, wars]);

    return { error, loading, summary, averages };
}
