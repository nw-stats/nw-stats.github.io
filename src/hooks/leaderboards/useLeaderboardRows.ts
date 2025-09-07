import { useQuery } from "@tanstack/react-query";
import { RETRY, STALE_TIME } from "../../constants/query";
import type { UseLeaderOptions } from "./leaderboardOptions";
import { getLeaderboard } from "../../services/leaderboards/leaderboardservice";
import { Qop } from "../../services/googlesheets/queryparameter";
import type { LeaderboardRow } from "../../schemas/leaderboard";

async function fetLeaderboardsByWarId(warIds: number[]): Promise<LeaderboardRow[]> {
    const params = warIds.map(item => ({
        field: 'warId' as const,
        operator: Qop.Eq,
        value: item,
    }));
    return await getLeaderboard(params);
}

async function fetchLeaderboardsByCharacters(characters: string[]): Promise<LeaderboardRow[]> {
    const params = characters.map(item => ({
        field: 'character' as const,
        operator: Qop.Eq,
        value: item,
    }));
    return getLeaderboard(params);
}

async function fetchLeaderboardsByCompanies(companies: string[]): Promise<LeaderboardRow[]> {
    const params = companies.map(item => ({
        field: 'company' as const,
        operator: Qop.Eq,
        value: item,
    }));
    return getLeaderboard(params);
}

async function fetchLeaderboardsAll(): Promise<LeaderboardRow[]> {
    return getLeaderboard();
}

export function useLeaderboardRows({
    warIds,
    characters,
    companyNames,
    enabled
}: UseLeaderOptions) {
    return useQuery<LeaderboardRow[], Error>({
        queryKey: ['leaderboardRows'],
        queryFn: async () => {
            if (warIds) {
                return await fetLeaderboardsByWarId(warIds);
            } else if (characters) {
                return await fetchLeaderboardsByCharacters(characters);
            } else if (companyNames) {
                return await fetchLeaderboardsByCompanies(companyNames);
            } else {
                return await fetchLeaderboardsAll();
            }
        },
        staleTime: STALE_TIME,
        retry: RETRY,
        enabled: enabled ?? true,
    })
}
