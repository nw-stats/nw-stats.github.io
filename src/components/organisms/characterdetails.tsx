import type { JSX } from "react";
import CharacterCard from "./charactercard";
import CharacterSummary from "../molecules/playersummary";
import CharacterWarHistory from "./characterwarhistory";
import type { CharacterDetails } from "../../types/characterdetails";

interface CharacterDetailsProps {
    details: CharacterDetails;
}
function CharacterDetailsDisplay({ details }: CharacterDetailsProps): JSX.Element {
    return (
        <div className="flex flex-col max-w-6xl mx-auto gap-2s">
            <CharacterCard player={details.character} />
            <CharacterSummary character={details.character} summary={details.totals} averages={details.normalized} />
            <CharacterWarHistory history={details.history} />
        </div >
    );
}

export default CharacterDetailsDisplay;
