import { useMemo } from "react";
import { useLeaderboardTable } from "./tables/useLeaderboardTable";
import { useRosterTable } from "./tables/useRosterTable";
import { rosterHasCharacter } from "../types/db/rosterrow";
import type { Ungrouped } from "../types/ungrouped";
import { GroupRosterByWarId } from "../services/rosterservice";
import type { SheetId } from "../constants/sheets";

export function useGroupless(sheetId: SheetId) {
    const { loading: lbLoading, error: lbError, leaderboardTable: lbTable } = useLeaderboardTable(sheetId);
    const { loading: rosterLoading, error: rosterError, rosterTable: rosterTable } = useRosterTable(sheetId);

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
