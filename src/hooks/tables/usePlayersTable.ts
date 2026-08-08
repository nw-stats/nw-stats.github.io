import { useCallback } from "react";
import type { PlayerRow } from "../../types/db/playerrow";
import { getPlayersTable } from "../../services/playerservice";
import type { SheetId } from "../../constants/sheets";
import { useFetch } from "../useFetch";

export function usePlayersTable(sheetId: SheetId) {
    const fetcher = useCallback(() => getPlayersTable(sheetId), [sheetId]);
    const { data: playerTable, loading, error } = useFetch<PlayerRow[]>(fetcher, []);
    return { playerTable, loading, error };
}
