import { useEffect, useState } from "react";
import { getPlayerNameFromAlt } from "../services/altservice";

export function usePlayerNameFromAlt(altName: string) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<unknown>(null);
    const [playerName, setPlayerName] = useState<string>(altName);
    useEffect(() => {
        let cancelled = false;
        async function fetchAll() {
            try {
                if (!altName) {
                    setPlayerName(altName);
                    return;
                }
                setLoading(true);
                const pname = await getPlayerNameFromAlt(altName);
                if (cancelled) return;
                if (!pname) {
                    setPlayerName(altName);
                    return;
                };
                setPlayerName(pname);
            } catch (err) {
                if (!cancelled) setError(err);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        fetchAll();
        return () => { cancelled = true };
    }, [altName]);

    return { loading, error, playerName };
}
