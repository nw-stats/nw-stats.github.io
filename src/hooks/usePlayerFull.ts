
import { useAlts } from "./base/useAlts";
import { useLeaderboardsByCharacters } from "./useLeaderboardsByCharacter";
import { useRosters } from "./useRostersById";
import { createPlayerDetailsAndSummary } from "../utils/player";
import { useMemo } from "react";
import { useWars } from "./base/useWars";

export function usePlayerDetails(playerName: string) {
    const { alts, loading: altsLoading, error: altsError } = useAlts(playerName);
    const altNames = alts.map(v => v.name) || [playerName];

    const { leaderboard, loading: lbLoading, error: lbError } = useLeaderboardsByCharacters(altNames);

    const warIds = useMemo(() => leaderboard.map(v => v.warid), [leaderboard]);
    const { rosters, loading: rostersLoading, error: rostersError } = useRosters(warIds);

    const { wars, loading: warsLoading, error: warsError } = useWars({ ids: warIds });

    const loading = altsLoading || lbLoading || rostersLoading || warsLoading;
    const error = altsError || lbError || rostersError || warsError;

    const details = createPlayerDetailsAndSummary(alts, leaderboard, rosters, wars);

    return {
        loading,
        error,
        details,
    };
}
