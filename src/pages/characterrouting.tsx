import type { JSX } from "react";
import { usePlayerNameFromAlt } from "../hooks/usePlayerNameFromAlt";
import Loading from "../components/atom/loading";
import NotFound from "./notfound";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function CharacterRouting(): JSX.Element {
    const { characterName } = useParams<{ characterName: string }>();
    const { loading, error, playerName } = usePlayerNameFromAlt(characterName);
    const navigate = useNavigate()

    if (loading) return <Loading />
    if (error) return <NotFound />

    navigate(`/players/${playerName}`);
    return (
        <div className="flex flex-row items-center">
            <Link to={`/players/${playerName}`}>
                {`${playerName} Profile`}
            </Link>
        </div>
    );
}
