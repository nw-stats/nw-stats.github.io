import { useMemo } from "react";
import { useLeaderboardtable } from "./tables/useLeaderboardTable";
import { useRosterTable } from "./tables/userRosterTable";
import { groupByPlayer, HydrateLeaderboardTable, normalizeLeaderboardEntries } from "../services/leaderboardservice";
import { GroupRosterByWarId } from "../services/rosterservice";
import { buildPlayerPerformanceProfile, buildRolePerformanceProfile, calculatePlayersZScore } from "../domain/stats";
import { useWarRaw } from "./base/useWarsRaw";
import { createCharacterToPlayerMap } from "../services/characterservice";
import { useCharactersTable } from "./tables/useCharactersTable";

export function useZScore() {
    const { loading: lbLoading, error: lbError, leaderboardTable: lbTable } = useLeaderboardtable();
    const { loading: rosterLoading, error: rosterError, rosterTable: rosterTable } = useRosterTable();
    const { loading: warLoading, error: warError, wars } = useWarRaw()
    const { loading: characterLoading, error: characterError, characterTable } = useCharactersTable();

    const normalizedProfile = useMemo(() => {
        const characterPlayerMap = createCharacterToPlayerMap(characterTable);
        const groupedRosters = GroupRosterByWarId(rosterTable);
        const leaderboardEntries = HydrateLeaderboardTable(lbTable, groupedRosters);
        const normalizedEntries = normalizeLeaderboardEntries(leaderboardEntries, wars);

        const leaderboardByPlayer = groupByPlayer(
            normalizedEntries,
            characterPlayerMap
        );

        const profile = buildPlayerPerformanceProfile(leaderboardByPlayer);

        return profile;
    }, [characterTable, lbTable, rosterTable, wars]);

    const rolePerformance = useMemo(() => {
        const groupedRosters = GroupRosterByWarId(rosterTable);
        const leaderboardEntries = HydrateLeaderboardTable(lbTable, groupedRosters);
        const normalizedEntries = normalizeLeaderboardEntries(leaderboardEntries, wars);

        return buildRolePerformanceProfile(normalizedEntries);
    }, [lbTable, rosterTable, wars]);

    const zscore = useMemo(() => {
        return calculatePlayersZScore(
            normalizedProfile,
            rolePerformance
        );
    }, [normalizedProfile, rolePerformance]);

    return {
        loading: lbLoading || rosterLoading || warLoading || characterLoading,
        error: lbError || rosterError || warError || characterError,
        zscore,
    };
}
