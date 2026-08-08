import { useMemo } from "react";
import { useLeaderboardTable } from "./tables/useLeaderboardTable";
import { useRosterTable } from "./tables/useRosterTable";
import { HydrateLeaderboardTable } from "../services/leaderboardservice";
import { GroupRosterByWarId } from "../services/rosterservice";
import { buildRolePerformanceProfile } from "../domain/stats";
import type { SheetId } from "../constants/sheets";

export function useMeanStdev(sheetId: SheetId) {
    const { loading: lbLoading, error: lbError, leaderboardTable: lbTable } = useLeaderboardTable(sheetId);
    const { loading: rosterLoading, error: rosterError, rosterTable: rosterTable } = useRosterTable(sheetId);

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
