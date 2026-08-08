import { useMemo } from "react";
import { useCompanies } from "../useCompanies";
import type { War } from "../../types/hydratedtypes/war";
import { hydrateWars } from "../../utils/hydrate";
import { useWarRaw } from "../base/useWarsRaw";
import type { UseWarsOptions } from "../options/waroptions";
import type { SheetId } from "../../constants/sheets";

export function useWarsHydrated(sheetId: SheetId, options?: UseWarsOptions) {
    const { error: rawWarsError, loading: rawWarsLoading, wars: rawWars } = useWarRaw(sheetId, options);
    const { error: companiesError, loading: companiesLoading, companies } = useCompanies(sheetId);

    const error = rawWarsError || companiesError;
    const loading = rawWarsLoading || companiesLoading;

    const wars = useMemo<War[]>(() => hydrateWars(rawWars, companies), [rawWars, companies]);

    return { loading, error, wars };
}
