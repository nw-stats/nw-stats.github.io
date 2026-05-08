// import type { JSX } from "react";
// import { FireIcon, FirstAidIcon, HandshakeIcon, HashIcon, SkullIcon, SwordIcon } from "@phosphor-icons/react";
// import StatWithIcon from "./statwithicon";
// import NumberCell from "../atom/numbercell";
// import type { Character } from "../../types/character";
// import { factionBgSecondary } from "../../utils/factions";
// import type { StatTotals } from "../../types/leaderboard";

import { FireIcon, FirstAidIcon, HandshakeIcon, HashIcon, SkullIcon, SwordIcon } from "@phosphor-icons/react";
import { factionBgPrimary } from "../../utils/factions";
import StatWithIcon from "./statwithicon";
import NumberCell from "../atom/numbercell";
import type { StatTotals } from "../../types/leaderboard";
import type { Character } from "../../types/character";
import type { JSX } from "react";

interface CharacterSummaryProps {
    character: Character;
    summary: StatTotals;
    averages: StatTotals;
}
// function CharacterSummary({ character, summary, averages }: CharacterSummaryProps): JSX.Element {

//     const color = factionBgSecondary(character.faction);
//     return (
//         <div className="flex flex-row">
//             <div className={`${color} p-4`}></div>
//             <div className={`grid grid-cols-1 text-foreground bg-surface-1p-1 gap-1 w-full`}>
//                 <h1 className="font-semibold">Lifetime</h1>
//                 <div className={`grid grid-cols-6 pb-2`}>
//                     <StatWithIcon icon={<HashIcon weight="bold" />} value={<NumberCell value={summary ? summary.count : 0} />} />
//                     <StatWithIcon icon={<SwordIcon weight="fill" />} value={<NumberCell value={summary ? summary.kills : 0} />} />
//                     <StatWithIcon icon={<SkullIcon weight="fill" />} value={<NumberCell value={summary ? summary.deaths : 0} />} />
//                     <StatWithIcon icon={<HandshakeIcon weight="fill" />} value={<NumberCell value={summary ? summary.assists : 0} />} />
//                     <StatWithIcon icon={<FirstAidIcon weight="fill" />} value={<NumberCell value={summary ? summary.healing : 0} />} />
//                     <StatWithIcon icon={<FireIcon weight="fill" />} value={<NumberCell value={summary ? summary.damage : 0} />} />
//                 </div>
//                 <div className="bg-background p-0.5"></div>
//                 <h1 className="font-semibold">Per War <span className="text-xs text-gray-400">(normalized to 30 minutes)</span></h1>
//                 {averages &&
//                     <div className={`grid grid-cols-6`}>
//                         <StatWithIcon icon={<HashIcon weight="bold" />} value={<NumberCell value={averages.count} />} />
//                         <StatWithIcon icon={<SwordIcon weight="fill" />} value={<NumberCell value={averages.kills} figures={2} />} />
//                         <StatWithIcon icon={<SkullIcon weight="fill" />} value={<NumberCell value={averages.deaths} figures={2} />} />
//                         <StatWithIcon icon={<HandshakeIcon weight="fill" />} value={<NumberCell value={averages.assists} figures={2} />} />
//                         <StatWithIcon icon={<FirstAidIcon weight="fill" />} value={<NumberCell value={averages.healing} figures={0} />} />
//                         <StatWithIcon icon={<FireIcon weight="fill" />} value={<NumberCell value={averages.damage} figures={0} />} />
//                     </div>
//                 }
//             </div>
//         </div>
//     );
// }

// export default CharacterSummary
const cardBase =
    "rounded-lg bg-background shadow-sm ring-1 ring-gray-700/50 overflow-hidden";
export default function CharacterSummary({ character, summary, averages }: CharacterSummaryProps): JSX.Element {
    const color = factionBgPrimary(character.faction);

    const StatRow = ({ title, children }: any) => (
        <div className="space-y-2">
            <div className="text-sm font-semibold text-gray-300">
                {title}
            </div>
            <div className="grid grid-cols-6 gap-2">
                {children}
            </div>
        </div>
    );

    return (
        <div className={`${cardBase} flex`}>
            <div className={`w-2 ${color}`} />

            <div className="p-4 w-full space-y-6 text-foreground">
                <StatRow title="Lifetime">
                    <StatWithIcon icon={<HashIcon weight="bold" />} value={<NumberCell value={summary?.count ?? 0} />} />
                    <StatWithIcon icon={<SwordIcon weight="fill" />} value={<NumberCell value={summary?.kills ?? 0} />} />
                    <StatWithIcon icon={<SkullIcon weight="fill" />} value={<NumberCell value={summary?.deaths ?? 0} />} />
                    <StatWithIcon icon={<HandshakeIcon weight="fill" />} value={<NumberCell value={summary?.assists ?? 0} />} />
                    <StatWithIcon icon={<FirstAidIcon weight="fill" />} value={<NumberCell value={summary?.healing ?? 0} />} />
                    <StatWithIcon icon={<FireIcon weight="fill" />} value={<NumberCell value={summary?.damage ?? 0} />} />
                </StatRow>

                <div className="h-px bg-surface" />

                <StatRow title="Per War (30 min normalized)">
                    <StatWithIcon icon={<HashIcon weight="bold" />} value={<NumberCell value={averages?.count ?? 0} />} />
                    <StatWithIcon icon={<SwordIcon weight="fill" />} value={<NumberCell value={averages?.kills ?? 0} figures={2} />} />
                    <StatWithIcon icon={<SkullIcon weight="fill" />} value={<NumberCell value={averages?.deaths ?? 0} figures={2} />} />
                    <StatWithIcon icon={<HandshakeIcon weight="fill" />} value={<NumberCell value={averages?.assists ?? 0} figures={2} />} />
                    <StatWithIcon icon={<FirstAidIcon weight="fill" />} value={<NumberCell value={averages?.healing ?? 0} figures={0} />} />
                    <StatWithIcon icon={<FireIcon weight="fill" />} value={<NumberCell value={averages?.damage ?? 0} figures={0} />} />
                </StatRow>
            </div>
        </div>
    );
}
