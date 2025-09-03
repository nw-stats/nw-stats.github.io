import { useState, useEffect } from "react";
import { getWars } from "../services/wars.ts/warservice";
import { getCompanies } from "../services/companies/companiesservice";
import { hydrateCompanies } from "../services/companies/hydrateCompanies";
import type { War } from "../types/war";
import { hydrateWars } from "../services/wars.ts/hydrateWars";


export function useHydratedWars() {
    const [wars, setWars] = useState<War[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        async function fetchAndHydrate() {
            try {
                setLoading(true);
                const rawWars = await getWars();
                const rawCompanies = await getCompanies();
                const companies = hydrateCompanies(rawCompanies);
                const hydrated = await hydrateWars(rawWars, companies);
                setWars(hydrated);
            } catch (err) {
                setError(err as Error);
            } finally {
                setLoading(false);
            }
        }

        fetchAndHydrate();
    }, []);

    return { wars, loading, error };
}
