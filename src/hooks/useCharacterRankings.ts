import { useMemo } from "react";
import { HydrateLeaderboardTable, summarizeLeaderboards } from "../services/leaderboardservice";
import { GroupRosterByWarId } from "../services/rosterservice";
import { useLeaderboardtable } from "./tables/useLeaderboardTable";
import { useRosterTable } from "./tables/userRosterTable";
import { fillKpars } from "../utils/leaderboard";
import { playerPerformanceKey, type PlayerRolePerformance } from "../types/characterperformance";

export function useCharacterRankings() {
    const { loading: lbLoading, error: lbError, leaderboardTable: lbTable } = useLeaderboardtable();
    const { loading: rosterLoading, error: rosterError, rosterTable: rosterTable } = useRosterTable();

    const rankings = useMemo(() => {
        const groupedRosters = GroupRosterByWarId(rosterTable);
        const leaderboardEntires = HydrateLeaderboardTable(lbTable, groupedRosters);
        const summaries = summarizeLeaderboards(leaderboardEntires);
        const enriched = fillKpars(leaderboardEntires, summaries);
        const performance = new Map<string, PlayerRolePerformance>();

        for (const row of enriched) {
            const key = playerPerformanceKey(row.character, row.roleAssignment.role);
            if (!performance.has(key)) {
                performance.set(key, {
                    name: row.character,
                    role: row.roleAssignment,
                    score: 0,
                    kills: 0,
                    deaths: 0,
                    assists: 0,
                    healing: 0,
                    damage: 0,
                    count: 0,
                    kpar: 0,
                });
            }

            const totals = performance.get(key);
            if (!totals) continue;

            totals.score += row.score;
            totals.kills += row.kills;
            totals.deaths += row.deaths;
            totals.assists += row.assists;
            totals.healing += row.healing;
            totals.damage += row.damage;
            totals.count += 1;
            totals.kpar += row.kpar;
        }
        for (const perf of performance.values()) {
            perf.kpar /= perf.count;
        }
        return Array.from(performance.values());
    }, [lbTable, rosterTable]); // 👈 critical
    return {
        loading: lbLoading || rosterLoading,
        error: lbError || rosterError,
        rankings,
    };
}
