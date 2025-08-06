import { useEffect, useMemo, useState } from "react";
import { useRostersByPlayer } from "./useRostersByPlayer";
import { createCharacterDetails } from "../utils/player";
import { useCharacter } from "./useCharacter";
import { useLeaderboardsByCharacters } from "./useLeaderboardsByCharacter";
import { useWarsById } from "./useWarsById";

export function usePlayerDetails(playerName: string) {
    const [error, setError] = useState<any>(null);

    const pHook = useCharacter(playerName);
    const rHook = useRostersByPlayer(playerName);
    const lbHook = useLeaderboardsByCharacters([playerName]);
    const warIds = useMemo(() => lbHook.leaderboard.map(v => v.warid), [lbHook.leaderboard]);
    const wHook = useWarsById(warIds);
    const loading = wHook.loading || rHook.loading || pHook.loading || lbHook.loading;

    const playerDetails = createCharacterDetails(lbHook.leaderboard, rHook.rosters, wHook.wars);
    useEffect(() => {
        setError(wHook.error || rHook.error || pHook.error || lbHook.error);
    }, [wHook.error, rHook.error, pHook.error, lbHook.error]);

    return { loading, error, details: playerDetails };
}
