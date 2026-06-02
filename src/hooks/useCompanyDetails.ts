import { useCompanies } from "./useCompanies";
import { useMembers } from "./useMembers";
import { useWarRaw } from "./base/useWarsRaw";
import { hydrateWars } from "../utils/hydrate";
import { useLeaderboards } from "./base/useLeaderboards";
import type { SheetId } from "../constants/sheets";



export function useCompanyDetails(sheetId: SheetId, name: string) {
    const { loading: warsLoading, error: warsError, wars } = useWarRaw(sheetId, { companies: [name] });
    const { loading: companyLoading, error: companyError, companies } = useCompanies(sheetId, [...(wars.map(v => v.attacker)), ...(wars.map(v => v.defender)), name]);
    const { loading: membersLoading, error: membersError, members } = useMembers(sheetId, name);
    const { loading: lbLoading, error: lbError, leaderboards } = useLeaderboards(sheetId, { companies: [name] });

    const loading = companyLoading || warsLoading || membersLoading || lbLoading;
    const error = companyError || warsError || membersError || lbError;

    return {
        loading,
        error,
        company: companies.find(v => v.name === name),
        leaderboards: leaderboards,
        wars: hydrateWars(wars, companies),
        members: members,
    };
}
