import { useEffect, useState } from "react";
import { useCompanies } from "./useCompanies";
import { useWarsByCompany } from "./useWarsByCompany";
import { useMembers } from "./useMembers";
import { useLeaderboardsByCompany } from "./useLeaderboardsByCompany";


export function useCompanyDetails(name: string) {
    const [error, setError] = useState<any>(null);

    const cHook = useCompanies([name]);
    const wHook = useWarsByCompany(name);
    const mHook = useMembers(name);
    const lbHook = useLeaderboardsByCompany(name);



    const loading = cHook.loading || wHook.loading || mHook.loading || lbHook.loading;

    useEffect(() => {
        setError(cHook.error || wHook.error || mHook.error || lbHook.error);
    });

    return {
        loading,
        error,
        company: cHook.companies[0],
        wars: wHook.wars,
        members: mHook.members,
        leaderboards: lbHook.leaderboard,
    };
}
