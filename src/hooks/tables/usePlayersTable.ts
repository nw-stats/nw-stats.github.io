import { useEffect, useState } from "react";
import type { PlayerRow } from "../../types/db/playerrow";
import { getPlayersTable } from "../../services/playerservice";

export function usePlayersTable(sheetId: string) {
    const [playerTable, SetPlayerTable] = useState<PlayerRow[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<unknown>(null);

    useEffect(() => {
        let cancelled = false;
        async function fetchAll() {
            setLoading(true);
            try {
                const pt = await getPlayersTable(sheetId);
                if (cancelled) return;
                SetPlayerTable(pt)
            } catch (err) {
                setError(err)
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        fetchAll();
        return () => { cancelled = true };
    }, [sheetId]);
    return { loading, error, playerTable };
}
