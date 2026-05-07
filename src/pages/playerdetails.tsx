import { useParams, useSearchParams } from "react-router-dom";
import NotFound from "./notfound";

import Loading from "../components/atom/loading";
import Dropdown from "../components/atom/dropdown";
import CharacterDetailsDisplay from "../components/organisms/characterdetails";
import { usePlayerDetails } from "../hooks/usePlayerFull";
import { useMemo, type JSX } from "react";

// function PlayerDetails() {
//     const { characterName } = useParams<{ characterName: string, mode?: string }>();
//     const [searchParams, setSearchParams] = useSearchParams();

//     const alt = searchParams.get('alt') || '';
//     const setAlt = (name: string) => {
//         setSearchParams(prev => {
//             const next = new URLSearchParams(prev);
//             next.set('alt', name.toLowerCase());
//             return next;
//         })
//     };


//     const { loading: loadingPlayerName, error: errorPlayerName, playerName } = usePlayerNameFromAlt(characterName);
//     const { loading, error, details } = usePlayerDetails(playerName);

//     let options = [...(details.keys() || [])];
//     options = options.sort((a, b) => {
//         if (a === 'All') return -1; // 'All' goes first
//         if (b === 'All') return 1;  // 'All' goes first
//         return a.toLocaleLowerCase().localeCompare(b.toLocaleLowerCase()); // alphabetical order
//     });

//     if (loading) return <Loading />;
//     if (!characterName) return <NotFound />;
//     if (!characterName) return <ErrorPage error={characterName} />;

//     return (
//         <div>
//             <div className="mx-auto max-w-6xl pt-6">
//                 <div className="inline-flex items-center gap-2 bg-gray-700 px-3 py-2 rounded-t-lg">
//                     <div className="text-white font-bold">Alt</div>
//                     <Dropdown options={options} value={selectedAlt} onChange={setSelectedAlt} />
//                 </div>
//             </div>
//             {charDetails ?
//                 <CharacterDetailsDisplay details={charDetails} /> :
//                 <div className="text-gray-400">No Data</div>
//             }
//         </div>
//     );
// }

// export default PlayerDetails;

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

    let options = [...(details.keys() || [])];
    options = options.sort((a, b) => {
        if (a === 'All') return -1; // 'All' goes first
        if (b === 'All') return 1;  // 'All' goes first
        return a.toLocaleLowerCase().localeCompare(b.toLocaleLowerCase()); // alphabetical order
    });

    const characterDetails = useMemo(() => {
        if (details.has(alt)) {
            return details.get(alt);
        }
        return details.get('All');
    }, [alt, details])

    if (!playerName) return <NotFound />
    if (loading) return <Loading />
    if (error) return <NotFound />

    return (
        <div className="mx-auto max-w-6xl py-6 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between rounded-lg bg-gray-800 px-4 py-3 shadow-sm ring-1 ring-gray-700/50">
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
