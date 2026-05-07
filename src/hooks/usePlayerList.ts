import { useMemo } from "react";
import { hydratePlayers } from "../services/playerservice";
import { useCharactersTable } from "./tables/useCharactersTable";
import { usePlayersTable } from "./tables/usePlayersTable";
import { hydrateCharacters } from "../services/characterservice";

export function usePlayerList() {
    const {
        loading: playersLoading,
        error: playersError,
        playerTable
    } = usePlayersTable();
    const {
        loading: characterLoading,
        error: characterError,
        characterTable
    } = useCharactersTable();

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
