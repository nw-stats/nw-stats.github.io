import { useCompanies } from "./useCompanies";
import { useMembers } from "./useMembers";
import { useWarRaw } from "./base/useWars";
import { hydrateWars } from "../utils/hydrate";
import { useLeaderboards } from "./useLeaderboards";


export function useCompanyDetails(name: string) {
    const { loading: warsLoading, error: warsError, wars } = useWarRaw({ companies: [name] });
    const { loading: companyLoading, error: companyError, companies } = useCompanies([...(wars.map(v => v.attacker)), ...(wars.map(v => v.defender)), name]);
    const { loading: membersLoading, error: membersError, members } = useMembers(name);
    const { loading: lbLoading, error: lbError, leaderboard } = useLeaderboards({ company: name });

    const loading = companyLoading || warsLoading || membersLoading || lbLoading;
    const error = companyError || warsError || membersError || lbError;

    return {
        loading,
        error,
        company: companies.find(v => v.name === name),
        leaderboards: leaderboard,
        wars: hydrateWars(wars, companies),
        members: members,
    };
}
