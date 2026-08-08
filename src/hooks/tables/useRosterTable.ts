import { useCallback } from "react";
import { getRosterTable } from "../../services/rosterservice";
import type { RosterRow } from "../../types/db/rosterrow";
import type { SheetId } from "../../constants/sheets";
import { useFetch } from "../useFetch";

export function useRosterTable(sheetId: SheetId) {
    const fetcher = useCallback(() => getRosterTable(sheetId), [sheetId]);
    const { data: rosterTable, loading, error } = useFetch<RosterRow[]>(fetcher, []);
    return { rosterTable, loading, error };
}
