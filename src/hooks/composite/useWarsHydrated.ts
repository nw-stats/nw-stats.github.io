import { useState, useEffect } from "react";
import { useCompanies } from "../../hooks2/useCompaniesNew";
import type { War } from "../../types/index.";
import { hydrateWars } from "../../utils/hydrate";
import { useWarRaw } from "../base/useWarsRaw";
import type { UseWarsOptions } from "../options/waroptions";

export function useWarsHydrated(options?: UseWarsOptions) {
    const [wars, setWars] = useState<War[]>([]);
    const { error: rawWarsError, loading: rawWarsLoading, wars: rawWars } = useWarRaw(options);
    const { err: companiesError, loading: companiesLoading, companies } = useCompanies();

    const error = rawWarsError || companiesError;
    const loading = rawWarsLoading || companiesLoading;

    useEffect(() => {
        const w = hydrateWars(rawWars, companies);
        setWars(w);
    }, [rawWars, companies]);
    return { loading, error, wars };
}
