import { useQuery } from "@tanstack/react-query";
import type { UseCompanyOptions } from "./companyOptions";
import { RETRY, STALE_TIME } from "../../constants/query";
import { getCompanies } from "../../services/companies/companiesservice";
import { Qop } from "../../services/googlesheets/queryparameter";
import type { CompanyRow } from "../../schemas/comapny";

export function useCompanyRows({
    companyNames,
    enabled
}: UseCompanyOptions) {
    return useQuery<CompanyRow[], Error>({
        queryKey: ['companyRows', companyNames],
        queryFn: async () => {
            const params = (companyNames
                ? companyNames?.map(item => ({
                    field: 'name' as const,
                    operator: Qop.Eq,
                    value: item,
                }))
                : undefined);

            const rows = await getCompanies(params);
            return rows;
        },
        staleTime: STALE_TIME,
        retry: RETRY,
        enabled: enabled ?? true,
    });
}
