import { useMemo } from "react";
import type { StatTotals } from "../types/leaderboard";
import { normalize, summarize } from "../utils/leaderboard";
import { useLeaderboards } from "./base/useLeaderboards";
import { useWarsHydrated } from "./composite/useWarsHydrated";
import type { SheetId } from "../constants/sheets";

export function useCharacterStats(sheetId: SheetId, playerName: string) {
    const { loading: lbLoading, error: lbError, leaderboards } = useLeaderboards(sheetId, { characters: [playerName] });
    const { loading: warsLoading, error: warsError, wars } = useWarsHydrated(sheetId, { ids: leaderboards.map(v => v.warid) });

    const loading = lbLoading || warsLoading;
    const error = lbError || warsError;

    const { summary, averages } = useMemo<{ summary: StatTotals | null; averages: StatTotals | null }>(() => {
        if (!leaderboards.length || !wars.length) return { summary: null, averages: null };
        const validEntries = leaderboards.filter(v => wars.some(w => w.id === v.warid));
        return { summary: summarize(validEntries), averages: normalize(leaderboards, wars) };
    }, [leaderboards, wars]);

    return { error, loading, summary, averages };
}
