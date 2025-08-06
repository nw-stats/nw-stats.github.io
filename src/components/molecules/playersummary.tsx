import type { JSX } from "react";
import { FireIcon, FirstAidIcon, HandshakeIcon, HashIcon, SkullIcon, SwordIcon } from "@phosphor-icons/react";
import StatWithIcon from "./statwithicon";
import NumberCell from "../atom/numbercell";
import type { Character } from "../../types/character";
import { factionBgSecondary } from "../../utils/factions";
import type { StatTotals } from "../../types/leaderboard";

interface CharacterSummaryProps {
    character: Character;
    summary: StatTotals;
    averages: StatTotals;
}
function CharacterSummary({ character, summary, averages }: CharacterSummaryProps): JSX.Element {

    const color = factionBgSecondary(character.faction);
    return (
        <div className="flex flex-row">
            <div className={`${color} p-4`}></div>
            <div className={`grid grid-cols-1 text-white bg-gray-700 p-1 gap-1 w-full`}>
                <h1 className="font-semibold">Lifetime</h1>
                <div className={`grid grid-cols-6 pb-2`}>
                    <StatWithIcon icon={<HashIcon weight="bold" />} value={<NumberCell value={summary ? summary.count : 0} />} />
                    <StatWithIcon icon={<SwordIcon weight="fill" />} value={<NumberCell value={summary ? summary.kills : 0} />} />
                    <StatWithIcon icon={<SkullIcon weight="fill" />} value={<NumberCell value={summary ? summary.deaths : 0} />} />
                    <StatWithIcon icon={<HandshakeIcon weight="fill" />} value={<NumberCell value={summary ? summary.assists : 0} />} />
                    <StatWithIcon icon={<FirstAidIcon weight="fill" />} value={<NumberCell value={summary ? summary.healing : 0} />} />
                    <StatWithIcon icon={<FireIcon weight="fill" />} value={<NumberCell value={summary ? summary.damage : 0} />} />
                </div>
                <div className="bg-gray-800 p-0.5"></div>
                <h1 className="font-semibold">Per War <span className="text-xs text-gray-400">(normalized to 30 minutes)</span></h1>
                {averages &&
                    <div className={`grid grid-cols-6`}>
                        <StatWithIcon icon={<HashIcon weight="bold" />} value={<NumberCell value={averages.count} />} />
                        <StatWithIcon icon={<SwordIcon weight="fill" />} value={<NumberCell value={averages.kills} figures={2} />} />
                        <StatWithIcon icon={<SkullIcon weight="fill" />} value={<NumberCell value={averages.deaths} figures={2} />} />
                        <StatWithIcon icon={<HandshakeIcon weight="fill" />} value={<NumberCell value={averages.assists} figures={2} />} />
                        <StatWithIcon icon={<FirstAidIcon weight="fill" />} value={<NumberCell value={averages.healing} figures={0} />} />
                        <StatWithIcon icon={<FireIcon weight="fill" />} value={<NumberCell value={averages.damage} figures={0} />} />
                    </div>
                }
            </div>
        </div>
    );
}

export default CharacterSummary
