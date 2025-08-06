import { useEffect, useState } from "react";
import type { Roster } from "../types/roster";
import { getRosters } from "../services/rosterservice";
import { Qop } from "../types/queryparameter";

export function useRosters(warIds: number[]) {
    const [rosters, setRosters] = useState<Map<number, Map<string, Roster>>>(new Map());
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<any>(null);
    const warKey = warIds.sort().join(',');


    useEffect(() => {
        let cancelled = false;
        async function fetchAll() {
            try {
                setLoading(true);

                const qp = warIds.map(v => ({ column: "B", fn: Qop.Eq, value: v }));
                const r = await getRosters(qp);
                if (cancelled) return;
                setRosters(r);

            } catch (err) {
                if (!cancelled) setError(err);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        fetchAll();
        return () => { cancelled = true };
    }, [warKey]);
    return { loading, error, rosters };
}
