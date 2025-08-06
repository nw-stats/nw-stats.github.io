import { useEffect, useState } from "react";
import type { War } from "../types/war";
import { getWars } from "../services/wardbservice";
import { type QueryParameter } from "../types/queryparameter";

export function useWarsById(withIds: number[]) {
    const [wars, setWars] = useState<War[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [err, setError] = useState<any>(null);

    useEffect(() => {
        let cancelled = false;

        async function fetchAll() {
            try {
                setLoading(true);
                const qp: QueryParameter[] = [];
                for (const wid of withIds) {
                    qp.push({ column: "A", fn: "=", value: wid });
                }
                const w = await getWars(qp);
                if (cancelled) return;
                setWars(w);

            } catch (err) {
                if (!cancelled) setError(err);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        fetchAll();
        return () => { cancelled = true; };
    }, []);

    return { loading, err, wars };
}
