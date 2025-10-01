import type { JSX } from "react";
import Loading from "../components/atom/loading";
import NotFound from "./notfound";
import { PlayerListCard } from "../components/atom/playerlistcard";
import { useHydratedPlayers } from "../hooks/players/useHydratedPlayers";

export function Players(): JSX.Element {
    const { data: players, isLoading, isError } = useHydratedPlayers();

    if (isLoading) return <Loading />;
    if (isError) return <NotFound />;
    if (!players) return <NotFound />;

    return (
        <>
            {players.map(item => <PlayerListCard player={item} />)}
        </>
    );
}
