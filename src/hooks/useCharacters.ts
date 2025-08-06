import { useEffect, useState } from "react";
import { getPlayers } from "../services/playerservice";
import type { Character } from "../types/character";

export function useCharacters() {
    const [players, setPlayers] = useState<Character[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<unknown>(null);

    useEffect(() => {
        let cancelled = false;

        async function fetchData() {
            try {
                setLoading(true);


                const p = await getPlayers();

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
    }, []);

    return { error, loading, players };
}
