import { useCallback } from "react";
import type { Character } from "../../types/character";
import { kCharacterColumns } from "../../mapping/charactersmap";
import { Qop } from "../../types/queryparameter";
import { getCharacters } from "../../services/characterservice";
import type { SheetId } from "../../constants/sheets";
import { useFetch } from "../useFetch";

export interface UseCharactersOptions {
    company?: string;
}

export function useCharacters(sheetId: SheetId, options?: UseCharactersOptions) {
    const company = options?.company;
    const fetcher = useCallback(() => {
        if (company) {
            return getCharacters(sheetId, [{ column: kCharacterColumns.company, fn: Qop.Eq, value: company }]);
        }
        return Promise.resolve<Character[]>([]);
    }, [sheetId, company]);
    const { data: members, loading, error } = useFetch<Character[]>(fetcher, []);
    return { loading, error, members };
}
