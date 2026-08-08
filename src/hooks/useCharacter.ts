import { useCallback } from "react";
import { getCharacter } from "../services/characterservice";
import type { Character } from "../types/character";
import type { SheetId } from "../constants/sheets";
import { useFetch } from "./useFetch";

export function useCharacter(sheetId: SheetId, playerName: string) {
    const fetcher = useCallback(() => getCharacter(sheetId, playerName), [sheetId, playerName]);
    const { data: player, loading, error } = useFetch<Character | null>(fetcher, null);
    return { error, loading, player };
}
