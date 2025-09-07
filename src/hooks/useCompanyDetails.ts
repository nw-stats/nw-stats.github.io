import { useHydratedWars } from "./wars/useHydratedWars";
import { useHydratedCompanies } from "./companies/useHydratedCompanies";
import { useHydratedCharacters } from "./characters/useHydratedCharacters";
import type { CompanyDetails } from "../types/companyDetails";

interface UseCompanyDetailsOptions {
    name?: string;
}

export function useCompanyDetails({ name }: UseCompanyDetailsOptions) {
    const {
        data: wars,
        isLoading: isLoadingWars,
        isError: isErrorWars,
        error: errorWars,
    } = useHydratedWars(name ? { companyNames: [name] } : { enabled: false });

    const {
        data: companies,
        isLoading: isLoadingCompanies,
        isError: isErrorCompanies,
        error: errorCompanies,
    } = useHydratedCompanies(name ? { companyNames: [name] } : { enabled: false });

    const {
        data: characters,
        isLoading: isLoadingCharacters,
        isError: isErrorCharacters,
        error: errorCharacters,
    } = useHydratedCharacters(name ? { fromCompanies: [name] } : { enabled: false });

    const companyDetails: CompanyDetails | null =
        companies && wars && characters
            ? {
                company: companies.find(c => c.name === name)!,
                wars,
                members: characters,
            }
            : null;

    const isLoading = isLoadingWars || isLoadingCompanies || isLoadingCharacters;
    const isError = isErrorWars || isErrorCompanies || isErrorCharacters;

    // Optional: combine errors if you want to expose a single error
    const error = errorWars || errorCompanies || errorCharacters || null;

    return { data: companyDetails, isLoading, isError, error };
}
