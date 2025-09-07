import { useQuery } from "@tanstack/react-query";
import { getCompanies } from "../../services/companies/companiesservice";
import { hydrateCompanies } from "../../services/companies/hydrateCompanies";
import { RETRY, STALE_TIME } from '../../constants/query';
import type { Company } from "../../types/company";
import { Qop } from "../../services/googlesheets/queryparameter";
import type { UseCompanyOptions } from "./companyOptions";

export function useHydratedCompanies({ companyNames, enabled }: UseCompanyOptions = {}) {
    return useQuery<Company[], Error>({
        queryKey: ['hydratedCompanies', companyNames],
        queryFn: async () => {
            const queryParameters = companyNames ? companyNames.map(item => ({
                field: 'name' as const,
                operator: Qop.Eq,
                value: item,
            })) : undefined;
            const rawCompanies = await getCompanies(queryParameters);
            const companies = hydrateCompanies(rawCompanies);
            return companies;
        },
        staleTime: STALE_TIME,
        retry: RETRY,
        enabled: enabled ?? true,
    });
}
