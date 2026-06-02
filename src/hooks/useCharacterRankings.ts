import { useMemo } from "react";
import { HydrateLeaderboardTable, summarizeLeaderboards } from "../services/leaderboardservice";
import { GroupRosterByWarId } from "../services/rosterservice";
import { useLeaderboardtable } from "./tables/useLeaderboardTable";
import { useRosterTable } from "./tables/userRosterTable";
import { fillKpars } from "../utils/leaderboard";
import { playerPerformanceKey, type PlayerRolePerformance } from "../types/characterperformance";
import { useCharactersTable } from "./tables/useCharactersTable";
import { createCharacterToPlayerMap } from "../services/characterservice";
import type { SheetId } from "../constants/sheets";

export function useCharacterRankings(sheetId: SheetId) {
    const { loading: lbLoading, error: lbError, leaderboardTable: lbTable } = useLeaderboardtable(sheetId);
    const { loading: rosterLoading, error: rosterError, rosterTable: rosterTable } = useRosterTable(sheetId);
    const { loading: characterLoading, error: characterError, characterTable } = useCharactersTable(sheetId);

    const rankings = useMemo(() => {
        const charPlayerMap = createCharacterToPlayerMap(characterTable);

        const groupedRosters = GroupRosterByWarId(rosterTable);
        const leaderboardEntires = HydrateLeaderboardTable(lbTable, groupedRosters);
        const summaries = summarizeLeaderboards(leaderboardEntires);
        const enriched = fillKpars(leaderboardEntires, summaries);
        const characterPerf = new Map<string, PlayerRolePerformance>();

        for (const row of enriched) {
            let player = charPlayerMap.get(row.character)
            if (!player) player = row.character;
            const key = playerPerformanceKey(player, row.roleAssignment.role);
            if (!characterPerf.has(key)) {
                characterPerf.set(key, {
                    name: player,
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

            const totals = characterPerf.get(key);
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
        for (const perf of characterPerf.values()) {
            perf.kpar /= perf.count;
        }
        return Array.from(characterPerf.values());
    }, [lbTable, rosterTable, characterTable]);
    return {
        loading: lbLoading || rosterLoading || characterLoading,
        error: lbError || rosterError || characterError,
        rankings,
    };
}
