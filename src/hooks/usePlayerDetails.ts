import { useEffect, useMemo, useState } from "react";
import { useRostersByPlayer } from "./useRostersByPlayer";
import { createCharacterDetails } from "../utils/player";
import { useCharacter } from "./useCharacter";
import { useWars } from "./base/useWars";
import { useLeaderboards } from "./base/useLeaderboards";

export function usePlayerDetails(character: string) {
    const [error, setError] = useState<any>(null);

    const pHook = useCharacter(character);
    const rHook = useRostersByPlayer(character);
    const lbHook = useLeaderboards({ characters: [character] })
    const warIds = useMemo(() => lbHook.leaderboards.map(v => v.warid), [lbHook.leaderboards]);
    const wHook = useWars({ ids: warIds });
    const loading = wHook.loading || rHook.loading || pHook.loading || lbHook.loading;

    const playerDetails = createCharacterDetails(lbHook.leaderboards, rHook.rosters, wHook.wars);
    useEffect(() => {
        setError(wHook.error || rHook.error || pHook.error || lbHook.error);
    }, [wHook.error, rHook.error, pHook.error, lbHook.error]);

    return { loading, error, details: playerDetails };
}
