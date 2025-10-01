import { useQuery } from "@tanstack/react-query";
import type { usePlayerOptions } from "./playerOptions";
import { usePlayerRows } from "./usePlayerRows";
import { RETRY, STALE_TIME } from "../../constants/query";
import { hydratePlayers } from "../../services/players/hydratePlayers";
import { useHydratedCharacters } from "../characters/useHydratedCharacters";
import type { Player } from "../../types/player";

export function useHydratedPlayers({ names, enabled }: usePlayerOptions = {}) {
    const { data: playerRows } = usePlayerRows({ names, enabled });
    const { data: characters } = useHydratedCharacters()
    return useQuery<Player[], Error>({

        queryKey: ['hydratedPlayers', names],
        queryFn: async () => {
            if (!playerRows) throw new Error("Player rows is empty");
            if (!characters) throw new Error("Characters is empty");
            return hydratePlayers(playerRows, characters);
        },
        staleTime: STALE_TIME,
        retry: RETRY,
        enabled: (!!playerRows
            && !!characters
            && playerRows.length > 0
            && characters.length > 0),
    })
}
