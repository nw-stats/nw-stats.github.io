import { useEffect, useState } from "react";
import type { Company } from "../types/company";
import { getCompanies } from "../services/companiesservice";


export function useCompanies() {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [err, setError] = useState<any>(null);

    useEffect(() => {
        let cancelled = false;

        async function fetchAll() {
            try {
                setLoading(true);
                let c = await getCompanies();
                c = c.sort((a, b) => a.name.localeCompare(b.name));
                if (cancelled) return;
                setCompanies(c);

            } catch (err) {
                if (!cancelled) setError(err);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        fetchAll();
        return () => { cancelled = true; };
    }, []);

    return { loading, err, companies };
}
