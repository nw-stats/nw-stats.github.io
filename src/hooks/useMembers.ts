import { useEffect, useState } from "react";
import { getPlayers } from "../services/playerservice";
import { Qop } from "../types/queryparameter";
import type { Character } from "../types/character";

export function useMembers(company: string) {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<any>(null);
    const [members, setMemebrs] = useState<Character[]>([]);

    useEffect(() => {
        let cancelled = false;
        async function fetchAll() {
            try {
                setLoading(true);
                const m = await getPlayers([{ column: "F", fn: Qop.Eq, value: company }]);
                if (cancelled) return;
                setMemebrs(m);
            } catch (err) {
                if (!cancelled) setError(err);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        fetchAll();
        return () => { cancelled = true };
    }, [company]);

    return { loading, error, members };
}
