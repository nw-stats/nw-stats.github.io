import { useQuery } from "@tanstack/react-query";
import { RETRY, STALE_TIME } from "../../constants/query";
import type { Character } from "../../types/character";
import { useHydratedCompanies } from "../companies/useHydratedCompanies";

import { hydrateCharacters } from "../../services/characters/hydrateCharacters";
import { useCharacterRows } from "./useCharacterRows";

interface UseHydratedCharactersOptions {
    names?: string[];
    fromCompanies?: string[];
    enabled?: boolean;
}
export function useHydratedCharacters({ names, fromCompanies, enabled }: UseHydratedCharactersOptions = {}) {
    const { data: rows, isLoading: rowsLoading } = useCharacterRows({ names, companyNames: fromCompanies, enabled });
    const companyNames = rows?.map(r => r.company).filter(Boolean) as string[] || undefined;
    const {
        data: companies,
        isLoading: companiesLoading,
    } = useHydratedCompanies({ companyNames: companyNames, enabled: !!rows && rows.length > 0 });
    const hydrated = useQuery<Character[], Error>({
        queryKey: ['hydratedCharacters', names],
        queryFn: async () => hydrateCharacters(rows!, companies!),
        staleTime: STALE_TIME,
        retry: RETRY,
        enabled: !!rows && !!companies,
    });

    return {
        ...hydrated,
        isLoading: rowsLoading || companiesLoading || hydrated.isLoading,
    };
}
