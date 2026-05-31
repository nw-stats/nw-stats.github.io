
import { useAlts } from "./base/useAlts";
import { useRosters } from "./useRostersById";
import { createPlayerDetailsAndSummary } from "../utils/player";
import { useEffect, useMemo, useState } from "react";
import { useLeaderboards } from "./base/useLeaderboards";
import { useWarsHydrated } from "./composite/useWarsHydrated";
import type { PlayerRow } from "../types/db/playerrow";
import { getPlayerRows } from "../services/playerservice";

export function usePlayer(sheetId: string, playerName?: string) {
    const [player, setPlayer] = useState<PlayerRow | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<unknown>(null);

    useEffect(() => {
        let cancelled = false;
        async function fetchData() {
            try {
                setLoading(true);
                if (playerName) {
                    const p = await getPlayerRows(sheetId, [playerName]);
                    if (cancelled) return;

                    if (p.length > 0)
                        setPlayer(p[0]);
                } else {
                    setPlayer(undefined);
                }
            } catch (err) {
                if (!cancelled) setError(err);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        fetchData();
        return () => { cancelled = true; };
    }, [playerName, sheetId]);
    return { loading, error, player };
}

export function usePlayerDetails(sheetId: string, playerName?: string) {
    const { player, loading: playerLoading, error: playerError } = usePlayer(sheetId, playerName);
    const { alts, loading: altsLoading, error: altsError } = useAlts(sheetId, playerName);
    const altNames = alts.map(v => v.name) || [playerName];
    const { leaderboards, loading: lbLoading, error: lbError } = useLeaderboards(sheetId, { characters: altNames });

    const warIds = useMemo(() => {
        const ids = new Set<number>()
        for (const lb of leaderboards) {
            ids.add(lb.warid)
        }
        return Array.from(ids)
    }, [leaderboards])

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
