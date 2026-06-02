import { useEffect, type JSX } from "react";
import { usePlayerNameFromAlt } from "../hooks/usePlayerNameFromAlt";
import Loading from "../components/atom/loading";
import NotFound from "./notfound";
import { useNavigate, useParams } from "react-router-dom";
import { useSeason } from "../hooks/base/useSeason";
import { kSheetIds } from "../constants/sheets";

export default function CharacterRouting(): JSX.Element {
    const { characterName } = useParams<{ characterName: string }>();
    const { season } = useSeason();
    const { loading, error, playerName } = usePlayerNameFromAlt(kSheetIds[season], characterName);
    const navigate = useNavigate();
    useEffect(() => {
        if (playerName) {
            navigate(`/players/${playerName}`, { replace: true });
        }
    }, [playerName, navigate]);

    if (loading) return <Loading />;
    if (error) return <NotFound />;

    return <></>;
}
