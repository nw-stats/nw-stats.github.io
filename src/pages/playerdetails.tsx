import { useParams } from "react-router-dom";
import NotFound from "./notfound";

import Loading from "../components/atom/loading";
import Dropdown from "../components/atom/dropdown";
import { useState } from "react";
import CharacterDetailsDisplay from "../components/organisms/characterdetails";
import { usePlayerDetails } from "../hooks/usePlayerFull";
import { usePlayerNameFromAlt } from "../hooks/usePlayerNameFromAlt";
import ErrorPage from "./errorpage";

function PlayerDetails() {
    const { characterName, mode } = useParams<{ characterName: string, mode?: string }>();
    if (!characterName) return <NotFound></NotFound>
    const [selectedAlt, setSelectedAlt] = useState(mode?.toLocaleLowerCase() === 'all' ? 'All' : characterName);

    if (!characterName) return <ErrorPage error={characterName} />;
    const { loading: loadingPlayerName, error: errorPlayerName, playerName } = usePlayerNameFromAlt(characterName);
    const { loading, error, details } = usePlayerDetails(playerName);

    if (loading || loadingPlayerName) return <Loading />;
    if (error || errorPlayerName || !playerName || !details) return <NotFound />;

    let options = [...(details.keys() || [])];
    options = options.sort((a, b) => {
        if (a === 'All') return -1; // 'All' goes first
        if (b === 'All') return 1;  // 'All' goes first
        return a.toLocaleLowerCase().localeCompare(b.toLocaleLowerCase()); // alphabetical order
    });

    let charDetails = null;
    if (details.has(selectedAlt)) {
        charDetails = details.get(selectedAlt)!;
    }

    return (
        <div>
            <div className="mx-auto max-w-6xl pt-6">
                <div className="inline-flex items-center gap-2 bg-gray-700 px-3 py-2 rounded-t-lg">
                    <div className="text-white font-bold">Alt</div>
                    <Dropdown options={options} value={selectedAlt} onChange={setSelectedAlt} />
                </div>
            </div>
            {charDetails ?
                <CharacterDetailsDisplay details={charDetails} /> :
                <div className="text-gray-400">No Data</div>
            }
        </div>
    );
}

export default PlayerDetails;
