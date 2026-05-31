import { useEffect, useMemo, useState } from "react";
import { useRostersByPlayer } from "./useRostersByPlayer";
import { createCharacterDetails } from "../utils/player";
import { useCharacter } from "./useCharacter";
import { useLeaderboards } from "./base/useLeaderboards";
import { useWarsHydrated } from "./composite/useWarsHydrated";

export function usePlayerDetails(sheetId: string, character: string) {
    const [error, setError] = useState<unknown>(null);

    const pHook = useCharacter(sheetId, character);
    const rHook = useRostersByPlayer(sheetId, character);
    const lbHook = useLeaderboards(sheetId, { characters: [character] })
    const warIds = useMemo(() => lbHook.leaderboards.map(v => v.warid), [lbHook.leaderboards]);
    const wHook = useWarsHydrated(sheetId, { ids: warIds });
    const loading = wHook.loading || rHook.loading || pHook.loading || lbHook.loading;

    const playerDetails = createCharacterDetails(lbHook.leaderboards, rHook.rosters, wHook.wars);
    useEffect(() => {
        setError(wHook.error || rHook.error || pHook.error || lbHook.error);
    }, [wHook.error, rHook.error, pHook.error, lbHook.error]);

    return { loading, error, details: playerDetails };
}
