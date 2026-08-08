import { useMemo } from "react";
import { useAlts } from "./base/useAlts";
import { useRosters } from "./useRostersById";
import { createPlayerDetailsAndSummary } from "../utils/player";
import { useLeaderboards } from "./base/useLeaderboards";
import { useWarsHydrated } from "./composite/useWarsHydrated";
import { usePlayer } from "./usePlayer";
import type { SheetId } from "../constants/sheets";

export function usePlayerDetails(sheetId: SheetId, playerName?: string) {
    const { player, loading: playerLoading, error: playerError } = usePlayer(sheetId, playerName);
    const { alts, loading: altsLoading, error: altsError } = useAlts(sheetId, playerName);
    const altNames = useMemo(() => alts.map(v => v.name), [alts]);
    const { leaderboards, loading: lbLoading, error: lbError } = useLeaderboards(sheetId, { characters: altNames });

    const warIds = useMemo(() => {
        const ids = new Set<number>();
        for (const lb of leaderboards) ids.add(lb.warid);
        return Array.from(ids);
    }, [leaderboards]);

    const { rosters, loading: rostersLoading, error: rostersError } = useRosters(sheetId, warIds);
    const { wars, loading: warsLoading, error: warsError } = useWarsHydrated(sheetId, { ids: warIds });

    const loading = altsLoading || lbLoading || rostersLoading || warsLoading || playerLoading;
    const error = altsError || lbError || rostersError || warsError || playerError;

    const details = createPlayerDetailsAndSummary(alts, leaderboards, rosters, wars);

    return {
        loading,
        error,
        player: { player, details }
    };
}
