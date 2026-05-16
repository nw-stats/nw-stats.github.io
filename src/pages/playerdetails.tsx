import { useParams, useSearchParams } from "react-router-dom";
import NotFound from "./notfound";

import Loading from "../components/atom/loading";
import Dropdown from "../components/atom/dropdown";
import CharacterDetailsDisplay from "../components/organisms/characterdetails";
import { usePlayerDetails } from "../hooks/usePlayerFull";
import { useMemo, type JSX } from "react";

export default function PlayerDetails(): JSX.Element {
    const { playerName } = useParams<{ playerName: string }>();
    const [searchParams, setSearchParams] = useSearchParams();
    const { loading, error, details } = usePlayerDetails(playerName);

    const alt = searchParams.get('alt') || '';
    const setAlt = (name: string) => {
        setSearchParams((prev) => {
            const next = new URLSearchParams(prev);
            next.set('alt', name);
            return next;
        })
    }
    console.log(details);

    const options = useMemo(() => {
        if (!details) return [];
        const o = [...details.keys() || []]
            .sort((a, b) => {
                if (a === 'All') return -1;
                if (b === 'All') return 1;
                return a.toLowerCase().localeCompare(b.toLowerCase());
            });
        return o;
    }, [details]);
    const characterDetails = useMemo(() => {
        if (!details) return undefined;
        if (details.has(alt)) {
            return details.get(alt);
        }
        return details.get('All');
    }, [alt, details]);

    if (!playerName) return <NotFound />
    if (loading) return <Loading />
    if (error) return <NotFound />

    return (
        <div className="mx-auto max-w-6xl py-6 space-y-4">
            {/* Header */}
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

            {/* Content */}
            {characterDetails && (
                <CharacterDetailsDisplay details={characterDetails} />
            )}

        </div>
    );
}
