import { useCallback } from "react";
import { getCharactersTable } from "../../services/characterservice";
import type { CharacterRow } from "../../types/db/characterrow";
import type { SheetId } from "../../constants/sheets";
import { useFetch } from "../useFetch";

export function useCharactersTable(sheetId: SheetId) {
    const fetcher = useCallback(() => getCharactersTable(sheetId), [sheetId]);
    const { data: characterTable, loading, error } = useFetch<CharacterRow[]>(fetcher, []);
    return { characterTable, loading, error };
}
