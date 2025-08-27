import { useEffect, useMemo, useState } from "react";
import { useRosters } from "./useRostersById";
import { useCompanies } from "./useCompanies";
import { getGroupDetails, getGroupSummaries } from "../utils/groups";
import { type GroupKey } from "../types/roster";
import type { GroupPerformance } from "../types/leaderboard";
import type { Company } from "../types/company";
import { useLeaderboards } from "./base/useLeaderboards";
import { summarizeLeaderboard } from "../services/leaderboardservice"; // refactor this. idk what it's doing in there.
import { fillKpar, splitLeaderboards } from "../utils/leaderboard";
import { useWarsHydrated } from "./composite/useWarsHydrated";
import { calculateHealerStats } from "../utils/healer";

export function useWarData(warId: number) {
    const [error, setError] = useState<any>(null);
    const lbHook = useLeaderboards({ warIds: [warId] });
    const wHook = useWarsHydrated({ ids: [warId], showHidden: true });
    const rHook = useRosters([warId]);
    const companies = useMemo(() => (wHook.wars.length !== 0 ? [wHook.wars[0].attacker.name, wHook.wars[0].defender.name] : []), [wHook.wars]);
    const cHook = useCompanies(companies);
    const loading = lbHook.loading || wHook.loading || rHook.loading || cHook.loading;


    const groupDetails = useMemo(() => {
        if (!lbHook.leaderboards || !rHook.rosters) return new Map<string, Map<GroupKey, GroupPerformance>>();
        const warRoster = rHook.rosters.get(warId);
        if (!warRoster) return new Map<string, Map<GroupKey, GroupPerformance>>();
        return getGroupDetails(lbHook.leaderboards, warRoster);
    }, [lbHook.leaderboards, rHook.rosters]);

    const summary = useMemo(() => {
        return summarizeLeaderboard(lbHook.leaderboards);
    }, [lbHook.leaderboards]);
    const split = useMemo(() => {
        return splitLeaderboards(lbHook.leaderboards);
    }, [lbHook.leaderboards]);
    const groupsSummary = useMemo(() => {
        return getGroupSummaries(groupDetails);
    }, [groupDetails]);
    const healerSummary = useMemo(() => {
        return calculateHealerStats(groupDetails);
    }, [groupDetails]);
    useMemo(() => {
        return fillKpar(lbHook.leaderboards, summary);
    }, [lbHook.leaderboards]);
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
        leaderboard: split,
        summary: summary,
        groupDetails,
        groupsSummary,
        healerSummary: healerSummary
    }
}
