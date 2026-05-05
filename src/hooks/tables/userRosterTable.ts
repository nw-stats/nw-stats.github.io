import { useEffect, useState } from "react";
import { getRosterTable } from "../../services/rosterservice";
import type { RosterRow } from "../../types/db/rosterrow";

export function useRosterTable() {
    const [rosterTable, setRosterTable] = useState<RosterRow[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<any>(null);

    useEffect(() => {
        let cancelled = false;
        async function fetchAll() {
            setLoading(true);
            try {
                const rt = await getRosterTable();
                if (cancelled) return;
                setRosterTable(rt)
            } catch (err) {
                setError(err)
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        fetchAll();
        return () => { cancelled = true };
    }, []);
    return { loading, error, rosterTable };
}
