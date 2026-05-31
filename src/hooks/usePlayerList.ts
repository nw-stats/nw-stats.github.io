import { useMemo } from "react";
import { hydratePlayers } from "../services/playerservice";
import { useCharactersTable } from "./tables/useCharactersTable";
import { usePlayersTable } from "./tables/usePlayersTable";
import { hydrateCharacters } from "../services/characterservice";

export function usePlayerList(sheetId: string) {
    const {
        loading: playersLoading,
        error: playersError,
        playerTable
    } = usePlayersTable(sheetId);
    const {
        loading: characterLoading,
        error: characterError,
        characterTable
    } = useCharactersTable(sheetId);

    const playerList = useMemo(() => {
        const characters = hydrateCharacters(characterTable);
        return hydratePlayers(playerTable, characters);
    }, [playerTable, characterTable]);

    return {
        loading: playersLoading || characterLoading,
        error: playersError || characterError,
        playerList
    }
}
