import { hydrateWars } from "../../services/wars.ts/hydrateWars";
import { useHydratedCompanies } from "../companies/useHydratedCompanies";
import { useWarRows } from "./useWarRows";
import type { UseWarsOptions } from "./warOptions";
import { useQuery } from "@tanstack/react-query";
import { RETRY, STALE_TIME } from "../../constants/query";
import type { War } from "../../types/war";
import { useMemo } from "react";

export function useHydratedWars({ warIds, companyNames, enabled }: UseWarsOptions = {}) {
    const { data: wars, } = useWarRows({ warIds, companyNames, enabled });
    const chainedCompanyNames = useMemo(() => {
        if (companyNames?.length) return companyNames;
        if (!wars) return undefined;
        return Array.from(new Set(wars.flatMap(w => [w.attacker, w.defender])));
    }, [companyNames, wars]);

    const {
        data: companies,
        isLoading: isLoadingCompanies,
        isError: isErrorCompanies,
    } = useHydratedCompanies({
        companyNames: chainedCompanyNames,
        enabled: !!chainedCompanyNames
    });

    return useQuery<War[], Error>({
        queryKey: ['hydratedWars', warIds, chainedCompanyNames],
        queryFn: () => {
            if (!wars || !companies) throw new Error("Wars or companies not loaded yet");
            return hydrateWars(wars, companies);
        },
        staleTime: STALE_TIME,
        retry: RETRY,
        enabled: !!wars && !!companies && wars.length > 0 && companies.length > 0,
    })
}
