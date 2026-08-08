import { useEffect, useState } from "react";
import { getPlayerNameFromAlt } from "../services/altservice";
import type { SheetId } from "../constants/sheets";

export function usePlayerNameFromAlt(sheetId: SheetId, altName: string | undefined) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<unknown>(null);
    const [playerName, setPlayerName] = useState<string | undefined>(undefined);
    useEffect(() => {
        let cancelled = false;
        async function fetchAll() {
            try {
                if (!altName) {
                    setPlayerName(undefined);
                    setLoading(false);
                    return;
                }
                setLoading(true);
                const pname = await getPlayerNameFromAlt(sheetId, altName);
                if (cancelled) return;
                if (!pname) {
                    return;
                };
                setPlayerName(pname);
            } catch (err) {
                console.error("getPlayerNameFromAlt failed", err);

                if (!cancelled) {
                    setError(err);
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        fetchAll();
        return () => { cancelled = true };
    }, [altName, sheetId]);

    return { loading, error, playerName };
}
