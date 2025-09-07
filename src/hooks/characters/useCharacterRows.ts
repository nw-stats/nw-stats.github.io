import { useQuery } from "@tanstack/react-query"
import type { CharacterRow } from "../schemas/character"
import { getCharacters } from "../services/characters/characterservice"
import { Qop } from "../services/googlesheets/queryparameter"
import { RETRY, STALE_TIME } from "../constants/query"

interface UseCharacterRowOptions {
    names?: string[];
    fromCompanies?: string[];
    enabled?: boolean;
}
export function useCharacterRows({ names, fromCompanies, enabled }: UseCharacterRowOptions = {}) {
    return useQuery<CharacterRow[], Error>({
        queryKey: ['characterRows', names],
        queryFn: async () => {
            const queryParameter = (
                names
                    ? names.map(item => ({
                        field: 'name' as const,
                        operator: Qop.Eq,
                        value: item,
                    }))
                    : fromCompanies
                        ? fromCompanies.map(item => ({
                            field: 'company' as const,
                            operator: Qop.Eq,
                            value: item
                        }))
                        : undefined)
            return getCharacters(queryParameter);
        },
        staleTime: STALE_TIME,
        retry: RETRY,
        enabled: enabled ?? true,
    })
}
