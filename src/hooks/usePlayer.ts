import { useEffect, useState } from "react";
import type { PlayerRow } from "../types/db/playerrow";
import { getPlayerRows } from "../services/playerservice";
import type { SheetId } from "../constants/sheets";

export function usePlayer(sheetId: SheetId, playerName?: string) {
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
                    if (p.length > 0) setPlayer(p[0]);
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
