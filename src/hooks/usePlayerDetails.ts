import { useMemo } from "react";
import { useHydratedLeaderboard } from "./leaderboards/useHydratedLeaderboard";
import { useHydratedPlayers } from "./players/useHydratedPlayers";

interface UsePlayerDetailsOptions {
    name: string;
}

export function usePlayerDetails({ name }: UsePlayerDetailsOptions) {
    const {
        data: players,
        isLoading: isLoadingPlayers,
        isError: isErrorPlayers,
        error: errorPlayers,
    } = useHydratedPlayers({ names: [name] });

    const player = useMemo(() => {
        if (players) {
            if (players.length >= 1) {
                return players[0];
            }
        }
        return undefined;
    }, [players]);

    const characters = useMemo(() => {
        if (player) {
            if (player.characters) {
                return player.characters.map(item => item.name);
            }
        }
        return undefined;
    }, [player]);

    const {
        data: leaderboards,
        isLoading: isLoadingLeaderboards,
        isError: isErrorLeaderboards,
        error: errorLeaderboard,
    } = useHydratedLeaderboard({
        characters: characters,
        enabled: !!characters,
    })

    return {
        data: {
            player,
            leaderboards,
        },
        isLoading: isLoadingPlayers || isLoadingLeaderboards,
        isError: isErrorPlayers || isErrorLeaderboards,
        error: errorPlayers || errorLeaderboard,
    }
}
