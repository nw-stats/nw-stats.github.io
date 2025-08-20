import { useEffect, useState } from "react";
import type { World } from "../../types/world";
import { getWorlds } from "../../services/worldservice";


export function useWorlds() {
    const [worlds, setWorlds] = useState<World[]>([]);
    const [loading, setLoading] = useState<Boolean>(true);
    const [error, setError] = useState<any>(null);

    useEffect(() => {
        let cancelled = false;
        async function fetchAll() {
            try {
                setLoading(true);
                const w = await getWorlds();
                if (cancelled) return;
                setWorlds(w);
            } catch (err) {
                if (!cancelled) setError(err);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        fetchAll();
        return () => { cancelled = true };
    }, []);
    return { loading, error, worlds };
}
