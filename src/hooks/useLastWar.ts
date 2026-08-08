import { useMemo } from "react";
import { DateTime } from "luxon";
import type { SheetId } from "../constants/sheets";
import { useCharactersTable } from "./tables/useCharactersTable";
import type { PlayerLastWar } from "../types/lastWar";
import { useLeaderboardTable } from "./tables/useLeaderboardTable";
import { useWarRaw } from "./base/useWarsRaw";

export function useLastWar(sheetId: SheetId) {
    const {
        loading: lbLoading,
        error: lbError,
        leaderboardTable: lbTable } = useLeaderboardTable(sheetId);
    const {
        loading: charLoading,
        error: charError,
        characterTable } = useCharactersTable(sheetId);

    const {
        loading: warsLoading,
        error: warsError,
        wars
    } = useWarRaw(sheetId);
    const playerLookup = useMemo(() => {
        const playerLookup = new Map<string, string>();
        for (const entry of characterTable) {
            playerLookup.set(entry.name, entry.player);
        }
        return playerLookup;
    }, [characterTable]);
    const warDateLookup = useMemo(() => {
        const warDateLookup = new Map<number, DateTime>();
        for (const entry of wars) {
            warDateLookup.set(entry.id, entry.date);
        }
        return warDateLookup;
    }, [wars]);
    const warParticipation = useMemo(() => {
        const warParticipation = new Map<string, number[]>();
        for (const entry of lbTable) {
            const char = entry.character;

            if (!playerLookup.has(char)) {
                continue;
            }

            const player = playerLookup.get(char)!;
            let participation = warParticipation.get(player)
            if (!participation) {
                participation = [];
                warParticipation.set(player, participation);
            }
            participation.push(entry.warid);
        }
        return warParticipation;
    }, [lbTable, playerLookup]);

    const lastWar: PlayerLastWar[] = useMemo(() => {
        const lastWar: PlayerLastWar[] = [];

        for (const [player, wars] of warParticipation.entries()) {
            const warDates: DateTime[] = []
            for (const war of wars) {
                const d = warDateLookup.get(war);
                if (!d) continue;
                warDates.push(d);
            }
            if (warDates.length > 0) {
                warDates.sort((a, b) => b.toUnixInteger() - a.toUnixInteger());
                lastWar.push({
                    name: player,
                    when: warDates[0],
                });
            }
        }
        return lastWar;
    }, [warDateLookup, warParticipation]);

    return {
        loading: lbLoading || charLoading || warsLoading,
        error: lbError || charError || warsError,
        lastWar
    }
}
