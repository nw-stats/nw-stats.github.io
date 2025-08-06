import { useEffect, useState } from "react";
import type { War } from "../types/war";
import { getWars } from "../services/wardbservice";
import { type OrderingOperator, type QueryOperator } from "../types/queryparameter";

export function useUpcomingAndPast() {
    const [upcomingWars, setUpcomingWars] = useState<War[]>([]);
    const [pastWars, setPastWars] = useState<War[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [err, setError] = useState<any>(null);

    useEffect(() => {
        let cancelled = false;

        async function fetchAll() {
            try {
                setLoading(true);
                const qpu = [{
                    column: "B",
                    fn: ">=" as unknown as QueryOperator,
                    value: new Date(),
                }];
                const qpp = [{
                    column: "B",
                    fn: "<=" as unknown as QueryOperator,
                    value: new Date(),
                }, {
                    column: "F",
                    fn: "IS NOT" as unknown as QueryOperator,
                    value: null
                }];
                const u = await getWars(qpu);
                const p = await getWars(qpp, 5, { column: "B", direction: "DESC" as unknown as OrderingOperator });
                if (cancelled) return;
                setUpcomingWars(u);
                setPastWars(p);

            } catch (err) {
                if (!cancelled) setError(err);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        fetchAll();
        return () => { cancelled = true; };
    }, []);

    return { loading, err, upcomingWars, pastWars };
}
