import { useEffect, useMemo, useState } from "react";
import { Qop, type QueryParameter } from "../types/queryparameter";
import type { War } from "../types/war";
import { getWars } from "../services/wardbservice";

export function useWarsById(withIds: number[]) {
    const [wars, setWars] = useState<War[]>([]);
    const [loading, setLoading] = useState<Boolean>(true);
    const [error, setError] = useState<any>(null);
    const warKey = useMemo(() => [...withIds].sort((a, b) => a - b).join(','), [withIds]);
    useEffect(() => {
        let cancelled = false;
        async function fetchAll() {
            try {
                setLoading(true);

                const query: QueryParameter[] = [];
                for (const wid of withIds) {
                    query.push({ column: "A", fn: Qop.Eq, value: wid });
                }
                query.push({ column: "N", fn: Qop.Neq, value: true });
                const w = (await getWars(query)).sort((a, b) => b.date.getTime() - a.date.getTime());
                if (cancelled) return;
                setWars(w)

            } catch (err) {
                if (!cancelled) setError(err);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        fetchAll();
        return () => { cancelled = true };
    }, [warKey]);

    return { loading, error, wars };
}
