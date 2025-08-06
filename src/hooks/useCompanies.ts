import { useEffect, useState } from "react";
import type { Company } from "../types/company";
import { getCompanies } from "../services/companiesservice";

export function useCompanies(names: string[]) {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<any>(null);

    useEffect(() => {
        let cancelled = false;
        async function fetchAll() {
            try {
                setLoading(true);
                const c = await getCompanies(names);
                if (cancelled) return;
                setCompanies(c);
            } catch (err) {
                if (!cancelled) setError(err);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        fetchAll();
        return () => { cancelled = true };
    }, [names.join(',')]);

    return { loading, error, companies };
}
