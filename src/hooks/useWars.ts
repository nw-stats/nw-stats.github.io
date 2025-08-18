import { useEffect, useMemo, useState } from "react";
import { useCompanies } from "../hooks2/useCompaniesNew";
import type { War } from "../types/war";
import { Qop, type QueryParameter } from "../types/queryparameter";
import { kWarColumns } from "../mapping/warmap";
import type { WarRaw } from "../types/rawtypes/warraw";
import { getWars } from "../services/wardbservice";
import { hydrateWars } from "../utils/hydrate";

export interface UseWarsOptions {
    ids?: number[];
    companies?: string[];
    players?: string[];
}

export function useWars(options?: UseWarsOptions) {
    const [error, setError] = useState<any>(null);
    const [loading, setLoading] = useState<Boolean>(true);
    const [wars, setWars] = useState<War[]>([]);
    const { error: rawWarsError, loading: rawWarsLoading, wars: rawWars } = useWarRaw(options);
    const { err: companiesError, loading: companiesLoading, companies } = useCompanies();

    useEffect(() => {
        setError(rawWarsError || companiesError);
    }, [rawWarsError, companiesError]);
    useEffect(() => {
        setLoading(rawWarsLoading || companiesLoading);
    }, [rawWarsLoading, companiesLoading]);


    useEffect(() => {
        const w = hydrateWars(rawWars, companies);
        setWars(w);
    }, [rawWars, companies]);
    return { loading, error, wars }
}

export function useWarRaw(options?: UseWarsOptions) {
    const [wars, setWars] = useState<WarRaw[]>([]);
    const [loading, setLoading] = useState<Boolean>(true);
    const [error, setError] = useState<any>(null);
    const warIdKey = useMemo(() => [...options?.ids || []].sort((a, b) => a - b).join(','), [options?.ids]);
    const warCompanyNameKey = useMemo(() => {
        const companies = options?.companies ?? [];
        return [...companies].sort((a, b) => a.localeCompare(b)).join(',');
    }, [options?.companies]);

    useEffect(() => {
        let cancelled = false;
        async function fetchAll() {
            try {
                setLoading(true);

                const queries: QueryParameter[][] = [];
                if (options?.ids) {
                    const query: QueryParameter[] = [{ column: kWarColumns.show, fn: Qop.Eq, value: true }];
                    for (const wid of options.ids) {
                        query.push({ column: kWarColumns.id, fn: Qop.Eq, value: wid });
                    }
                    queries.push(query);

                } else if (options?.companies) {
                    const atkQuery: QueryParameter[] = [{ column: kWarColumns.show, fn: Qop.Eq, value: true }];
                    const defQuery: QueryParameter[] = [{ column: kWarColumns.show, fn: Qop.Eq, value: true }];
                    for (const name of options.companies) {
                        atkQuery.push({ column: kWarColumns.attacker, fn: Qop.Eq, value: name });
                        defQuery.push({ column: kWarColumns.defender, fn: Qop.Eq, value: name });
                    }
                    queries.push(atkQuery);
                    queries.push(defQuery);
                }

                let w: WarRaw[] = [];
                if (queries.length === 0) {
                    w = await getWars([{ column: kWarColumns.show, fn: Qop.Eq, value: true }]);
                } else {
                    const results = await Promise.all(
                        queries.map(query => {
                            const q = [...query, { column: kWarColumns.show, fn: Qop.Eq, value: true }];
                            return getWars(q);
                        })
                    );
                    w = results.flat().sort((a, b) => b.date.toMillis() - a.date.toMillis());
                }

                if (!cancelled) {
                    setWars(w);
                }

            } catch (err) {
                if (!cancelled) setError(err);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        fetchAll();
        return () => { cancelled = true };
    }, [warIdKey, warCompanyNameKey]);

    return { loading, error, wars };
}
