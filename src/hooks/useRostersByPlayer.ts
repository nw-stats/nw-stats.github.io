import { useEffect, useState } from "react";
import type { Roster } from "../types/roster";
import { getRosters } from "../services/rosterservice";
import { Qop } from "../types/queryparameter";

export function useRostersByPlayer(player: string) {
    const [rosters, setRosters] = useState<Map<number, Map<string, Roster>>>(new Map());
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<any>(null);

    useEffect(() => {
        let cancelled = false;
        async function fetchAll() {
            try {
                setLoading(true);
                const qp = { column: "D", fn: Qop.Eq, value: player }
                const r = await getRosters([qp]);
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
    }, [player]);
    return { loading, error, rosters };
}
