import { useEffect, type JSX } from "react";
import { usePlayerNameFromAlt } from "../hooks/usePlayerNameFromAlt";
import Loading from "../components/atom/loading";
import NotFound from "./notfound";
import { useNavigate, useParams } from "react-router-dom";

export default function CharacterRouting(): JSX.Element {
    const { characterName } = useParams<{ characterName: string }>();
    const { loading, error, playerName } = usePlayerNameFromAlt(characterName);
    const navigate = useNavigate();
    console.log('PP', playerName);
    useEffect(() => {
        if (playerName) {
            navigate(`/players/${playerName}`, { replace: true });
        }
    }, [playerName, navigate]);

    if (loading) return <Loading />;
    if (error) return <NotFound />;

    return <></>;
}
