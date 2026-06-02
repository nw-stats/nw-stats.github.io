import { useEffect, useState } from "react";
import { getPlayerNameFromAlt } from "../services/altservice";
import type { SheetId } from "../constants/sheets";


export function usePlayerFromAlt(sheetId: SheetId, altname?: string) {
    const [player, setPlayer] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<unknown>(null);

    useEffect(() => {
        let cancelled = false;

        async function fetchData() {
            try {
                setLoading(true);
                let theName = altname ? altname : null;
                if (altname) {
                    const p = await getPlayerNameFromAlt(sheetId, altname);
                    if (p) {
                        theName = p;
                    }
                }

                if (cancelled) return;
                setPlayer(theName)

            } catch (err) {
                if (!cancelled) setError(err);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        fetchData();

        return () => {
            cancelled = true; // Prevent state update on unmounted component
        };
    }, [altname]);

    return { error, loading, player };
}
