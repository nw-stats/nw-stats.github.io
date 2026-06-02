import { useMemo } from "react";
import { useLeaderboardtable } from "./tables/useLeaderboardTable";
import { useCharactersTable } from "./tables/useCharactersTable";
import { createCharacterToPlayerMap } from "../services/characterservice";
import type { SheetId } from "../constants/sheets";

export function useOrphanedCharacters(sheetId: SheetId) {
    const { loading: lbLoading, error: lbError, leaderboardTable: lbTable } = useLeaderboardtable(sheetId);
    const { loading: characterLoading, error: characterError, characterTable } = useCharactersTable(sheetId);

    const orphans = useMemo(() => {
        const charPlayerMap = createCharacterToPlayerMap(characterTable);
        const orphans_set: Set<string> = new Set();
        for (const row of lbTable) {
            if (charPlayerMap.has(row.character)) {
                const player = charPlayerMap.get(row.character);
                if (player) {
                    continue;
                }
            }
            orphans_set.add(row.character);
        }

        const orphans = Array.from(orphans_set);
        return orphans;
    }, [lbTable, characterTable]);
    return {
        loading: lbLoading || characterLoading,
        error: lbError || characterError,
        orphans,
    };
}
