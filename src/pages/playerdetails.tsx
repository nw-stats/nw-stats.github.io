import { useParams, useSearchParams } from "react-router-dom";
import NotFound from "./notfound";

import Loading from "../components/atom/loading";
import Dropdown from "../components/atom/dropdown";
import CharacterDetailsDisplay from "../components/organisms/characterdetails";
import { usePlayerDetails } from "../hooks/usePlayerFull";
import { useMemo, type JSX } from "react";
import PlayerCard from "../components/organisms/playercard";

export default function PlayerDetails(): JSX.Element {
    const { playerName } = useParams<{ playerName: string }>();
    const [searchParams, setSearchParams] = useSearchParams();

    const { loading, error, player } = usePlayerDetails(playerName);
    const alt = searchParams.get('alt') || '';
    const setAlt = (name: string) => {
        setSearchParams((prev) => {
            const next = new URLSearchParams(prev);
            next.set('alt', name);
            return next;
        })
    }

    const options = useMemo(() => {
        if (!player.details) return [];
        const o = [...player.details.keys() || []]
            .sort((a, b) => {
                if (a === 'All') return -1;
                if (b === 'All') return 1;
                return a.toLowerCase().localeCompare(b.toLowerCase());
            });
        return o;
    }, [player.details]);
    const characterDetails = useMemo(() => {
        if (!player.details) return undefined;
        if (player.details.has(alt)) {
            return player.details.get(alt);
        }
        return player.details.get('All');
    }, [alt, player.details]);

    if (!playerName) return <NotFound />
    if (loading) return <Loading />
    if (error) return <NotFound />

    return (
        <div className="mx-auto max-w-6xl py-6 space-y-4">
            {/* Header */}
            {player.player && <PlayerCard player={player.player} />}
            <div className="flex items-center justify-between rounded-lg bg-background px-4 py-3 shadow-sm ring-1 ring-gray-700/50">
                <div className="flex items-center gap-3">
                    <div className="text-sm font-semibold text-gray-300 uppercase tracking-wide">
                        Alt
                    </div>

                    <div className="h-4 w-px bg-gray-600" />

                    <Dropdown
                        options={options}
                        value={alt}
                        onChange={setAlt}
                    />
                </div>
            </div>
            {characterDetails && (
                <CharacterDetailsDisplay details={characterDetails} />
            )}

        </div>
    );
}
