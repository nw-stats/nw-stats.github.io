import { useEffect, useState } from "react";
import { getCharacters } from "../services/characterservice";
import type { Character } from "../types/character";

export function useCharacters(sheetId: string) {
    const [players, setPlayers] = useState<Character[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<unknown>(null);

    useEffect(() => {
        let cancelled = false;

        async function fetchData() {
            try {
                setLoading(true);


                const p = await getCharacters(sheetId);

                if (cancelled) return;
                setPlayers(p)

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
    }, [sheetId]);

    return { error, loading, players };
}
