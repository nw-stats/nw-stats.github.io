import { useMemo } from "react";
import { useLeaderboardtable } from "./tables/useLeaderboardTable";
import { useRosterTable } from "./tables/userRosterTable";
import { rosterHasCharacter } from "../types/db/rosterrow";
import type { Ungrouped } from "../types/ungrouped";
import { GroupRosterByWarId } from "../services/rosterservice";

export function useGroupless() {
    const { loading: lbLoading, error: lbError, leaderboardTable: lbTable } = useLeaderboardtable();
    const { loading: rosterLoading, error: rosterError, rosterTable: rosterTable } = useRosterTable();

    const groupless = useMemo(() => {
        const groupedRosters = GroupRosterByWarId(rosterTable);
        const groupless: Ungrouped[] = []
        for (const row of lbTable) {
            const roster = groupedRosters.get(row.warid);
            if (roster) {
                if (!rosterHasCharacter(roster, row.character)) {
                    groupless.push({
                        character: row.character,
                        leaderboard: row,
                        warid: row.warid
                    })
                }
            }
        }
        return groupless
    }, [lbTable, rosterTable]);

    return {
        loading: lbLoading || rosterLoading,
        error: lbError || rosterError,
        groupless,
    };
}
