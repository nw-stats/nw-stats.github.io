import { useMemo } from "react";
import { useLeaderboardTable } from "./tables/useLeaderboardTable";
import { useRosterTable } from "./tables/useRosterTable";
import { groupByPlayer, HydrateLeaderboardTable, normalizeLeaderboardEntries } from "../services/leaderboardservice";
import { GroupRosterByWarId } from "../services/rosterservice";
import { buildPlayerPerformanceProfile, buildRolePerformanceProfile, calculatePlayersZScore } from "../domain/stats";
import { useWarRaw } from "./base/useWarsRaw";
import { createCharacterToPlayerMap } from "../services/characterservice";
import { useCharactersTable } from "./tables/useCharactersTable";
import type { SheetId } from "../constants/sheets";

export function useZScore(sheetId: SheetId) {
    const { loading: lbLoading, error: lbError, leaderboardTable: lbTable } = useLeaderboardTable(sheetId);
    const { loading: rosterLoading, error: rosterError, rosterTable: rosterTable } = useRosterTable(sheetId);
    const { loading: warLoading, error: warError, wars } = useWarRaw(sheetId)
    const { loading: characterLoading, error: characterError, characterTable } = useCharactersTable(sheetId);

    const hydratedEntries = useMemo(() => {
        const groupedRosters = GroupRosterByWarId(rosterTable);
        return HydrateLeaderboardTable(lbTable, groupedRosters);
    }, [lbTable, rosterTable]);

    const normalizedEntries = useMemo(() => {
        return normalizeLeaderboardEntries(hydratedEntries, wars);
    }, [hydratedEntries, wars]);

    const normalizedProfile = useMemo(() => {
        const characterPlayerMap = createCharacterToPlayerMap(characterTable);
        const leaderboardByPlayer = groupByPlayer(normalizedEntries, characterPlayerMap);
        return buildPlayerPerformanceProfile(leaderboardByPlayer);
    }, [characterTable, normalizedEntries]);

    const rolePerformance = useMemo(() => {
        return buildRolePerformanceProfile(normalizedEntries);
    }, [normalizedEntries]);

    const zscore = useMemo(() => {
        return calculatePlayersZScore(normalizedProfile, rolePerformance);
    }, [normalizedProfile, rolePerformance]);

    return {
        loading: lbLoading || rosterLoading || warLoading || characterLoading,
        error: lbError || rosterError || warError || characterError,
        zscore,
    };
}
