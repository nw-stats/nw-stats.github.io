import { useMemo, type JSX } from "react";
import Dropdown from "../components/atom/dropdown";
import { usePlayerList } from "../hooks/usePlayerList";
import { useSearchParams } from "react-router-dom";
import Loading from "../components/atom/loading";
import NotFound from "./notfound";

function PlayerCompare(): JSX.Element {
    const { loading, error, playerList } = usePlayerList();
    const [searchParams, setSearchParams] = useSearchParams();

    const player1 = searchParams.get("p1") ?? "";
    const player2 = searchParams.get("p2") ?? "";

    const setPlayer1 = (player1: string) => {
        setSearchParams(prev => {
            const next = new URLSearchParams(prev);
            next.set("p1", player1);
            return next;
        });
    };

    const setPlayer2 = (player2: string) => {
        setSearchParams(prev => {
            const next = new URLSearchParams(prev);
            next.set("p2s", player2);
            return next;
        });
    }


    const player1Options = useMemo(() => {
        return playerList.map(v => v.name);
    }, [playerList]);
    const player2Options = useMemo(() => {
        return playerList.map(v => v.name);
    }, [playerList]);

    if (loading) return <Loading />
    if (error) return <NotFound />
    return (
        <div>
            <Dropdown options={player1Options} value={player1} onChange={setPlayer1} />
            <Dropdown options={player2Options} value={player2} onChange={setPlayer2} />

        </div>
    );
}

export default PlayerCompare;
