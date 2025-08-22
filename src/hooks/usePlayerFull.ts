
import { useAlts } from "./base/useAlts";
import { useRosters } from "./useRostersById";
import { createPlayerDetailsAndSummary } from "../utils/player";
import { useMemo } from "react";
import { useWars } from "./base/useWars";
import { useLeaderboards } from "./base/useLeaderboards";

export function usePlayerDetails(playerName: string) {
    const { alts, loading: altsLoading, error: altsError } = useAlts(playerName);
    const altNames = alts.map(v => v.name) || [playerName];

    const { leaderboards, loading: lbLoading, error: lbError } = useLeaderboards({ characters: altNames });

    const warIds = useMemo(() => leaderboards.map(v => v.warid), [leaderboards]);
    const { rosters, loading: rostersLoading, error: rostersError } = useRosters(warIds);

    const { wars, loading: warsLoading, error: warsError } = useWars({ ids: warIds });

    const loading = altsLoading || lbLoading || rostersLoading || warsLoading;
    const error = altsError || lbError || rostersError || warsError;

    const details = createPlayerDetailsAndSummary(alts, leaderboards, rosters, wars);

    return {
        loading,
        error,
        details,
    };
}
