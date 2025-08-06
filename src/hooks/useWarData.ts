import { useEffect, useMemo, useState } from "react";
import { useLeaderboardsByIds } from "./useLeaderboardsById";
import { useRosters } from "./useRostersById";
import { useCompanies } from "./useCompanies";
import { useWarsById } from "./useWarsById";
import { getGroupDetails, getGroupSummaries } from "../utils/groups";
import { type GroupKey } from "../types/roster";
import type { GroupPerformance } from "../types/leaderboard";
import type { Company } from "../types/company";

export function useWarData(warId: number) {
    const [error, setError] = useState<any>(null);

    const lbHook = useLeaderboardsByIds(warId);
    const wHook = useWarsById([warId]);
    const rHook = useRosters([warId]);
    const companies = useMemo(() => (wHook.wars.length !== 0 ? [wHook.wars[0].attacker, wHook.wars[0].defender] : []), [wHook.wars]);
    const cHook = useCompanies(companies);
    const loading = lbHook.loading || wHook.loading || rHook.loading || cHook.loading;

    const groupDetails = useMemo(() => {
        if (!lbHook.leaderboard || !rHook.rosters) return new Map<string, Map<GroupKey, GroupPerformance>>();
        const warRoster = rHook.rosters.get(warId);
        if (!warRoster) return new Map<string, Map<GroupKey, GroupPerformance>>();
        return getGroupDetails(lbHook.leaderboard, warRoster);
    }, [lbHook.leaderboard, rHook.rosters]);

    const groupsSummary = useMemo(() => {
        return getGroupSummaries(groupDetails);
    }, [groupDetails]);

    const companyMap = new Map<string, Company>();
    for (const company of cHook.companies) {
        companyMap.set(company.name, company);
    }

    useEffect(() => {
        setError(lbHook.error || wHook.error || rHook.error || cHook.error);
    }, [lbHook.error, wHook.error, rHook.error, cHook.error]);



    return {
        loading,
        error,
        war: wHook.wars.at(0),
        companies: companyMap,
        leaderboard: lbHook.leaderboard,
        summary: lbHook.summary,
        groupDetails,
        groupsSummary,
    }
}
