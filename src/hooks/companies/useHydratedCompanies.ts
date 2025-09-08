import { useQuery } from "@tanstack/react-query";
import { RETRY, STALE_TIME } from '../../constants/query';
import type { Company } from "../../types/company";
import type { UseCompanyOptions } from "./companyOptions";
import { useCompanyRows } from "./useCompanyRows";
import { hydrateCompanies } from "../../services/companies/hydrateCompanies";

export function useHydratedCompanies({ companyNames, enabled }: UseCompanyOptions = {}) {
    const {
        data: rows,
    } = useCompanyRows({ companyNames, enabled });

    const {
        data: companies,
        isError,
        isLoading
    } = useQuery<Company[], Error>({
        queryKey: ['hydratedCompanies', companyNames],
        queryFn: async () => {
            if (!rows) throw new Error("Company rows is empty");
            const companies = hydrateCompanies(rows);
            return companies;
        },
        staleTime: STALE_TIME,
        retry: RETRY,
        enabled: !!rows && rows.length > 0,
    });

    return { data: companies, isError, isLoading };
}
