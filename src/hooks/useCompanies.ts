import { useCallback, useMemo } from "react";
import type { Company } from "../types/company";
import { getCompanies } from "../services/companiesservice";
import type { SheetId } from "../constants/sheets";
import { useFetch } from "./useFetch";

export function useCompanies(sheetId: SheetId, names?: string[]) {
    const namesKey = useMemo(() => names?.join(',') ?? '', [names]);
    const fetcher = useCallback(() => getCompanies(sheetId, names), [sheetId, namesKey]);
    const { data: companies, loading, error } = useFetch<Company[]>(fetcher, []);
    return { companies, loading, error };
}
