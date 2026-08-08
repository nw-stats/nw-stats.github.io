import { useParams, useSearchParams } from "react-router-dom";
import NotFound from "./notfound";

import Loading from "../components/atom/loading";
import Dropdown from "../components/atom/dropdown";
import CharacterDetailsDisplay from "../components/organisms/characterdetails";
import { usePlayerDetails } from "../hooks/usePlayerDetails";
import { useMemo, type JSX } from "react";
import PlayerCard from "../components/organisms/playercard";
import { useSeason } from "../hooks/base/useSeason";
import { kSheetIds } from "../constants/sheets";

export default function PlayerDetails(): JSX.Element {
    const { playerName } = useParams<{ playerName: string }>();
    const [searchParams, setSearchParams] = useSearchParams();
    const { season } = useSeason();
    const { loading, error, player } = usePlayerDetails(kSheetIds[season], playerName);
    const alt = searchParams.get('alt') ?? 'All';
    const setAlt = (name: string) => {
        setSearchParams(prev => {
            const next = new URLSearchParams(prev);

            if (name === 'All') {
                next.delete('alt');
            } else {
                next.set('alt', name);
            }

            return next;
        }, { replace: true });
    };

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
        return player.details.get(alt);
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
