import { useMemo } from "react";
import { useLeaderboardtable } from "./tables/useLeaderboardTable";
import { useRosterTable } from "./tables/userRosterTable";
import { HydrateLeaderboardTable } from "../services/leaderboardservice";
import { GroupRosterByWarId } from "../services/rosterservice";
import { buildRolePerformanceProfile } from "../domain/stats";

export function useMeanStdev() {
    const { loading: lbLoading, error: lbError, leaderboardTable: lbTable } = useLeaderboardtable();
    const { loading: rosterLoading, error: rosterError, rosterTable: rosterTable } = useRosterTable();
    //const { loading: characterLoading, error: characterError, characterTable } = useCharactersTable();

    const zscore = useMemo(() => {
        const groupedRosters = GroupRosterByWarId(rosterTable);
        const leaderboardEntires = HydrateLeaderboardTable(lbTable, groupedRosters);
        const profile = buildRolePerformanceProfile(leaderboardEntires);

        return profile;
    }, [lbTable, rosterTable]);
    return {
        loading: lbLoading || rosterLoading,
        error: lbError || rosterError,
        zscore,
    };
}
