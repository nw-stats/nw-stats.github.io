import StatWithIcon from "./statwithicon";
import type { StatTotals } from "../../types/leaderboard";
import type { Faction } from "../../types/faction";
import NumberCell from "../atom/numbercell";
import { Link } from "react-router-dom";
import { CrownIcon, FireIcon, FirstAidIcon, HandshakeIcon, SkullIcon, SwordIcon } from "@phosphor-icons/react";


interface WarResultsSummaryProp {
    summary: StatTotals,
    faction: Faction,
    isAttacker: boolean,
    isWinner: boolean
}

const WarResultsCompany: React.FC<WarResultsSummaryProp> = ({ summary, faction, isAttacker, isWinner }) => {
    let color = 'bg-gray-700';
    let accent = 'bg-gray-800';
    if (faction === 'Marauder') {
        color = 'bg-green-700';
        accent = 'bg-green-800';
    } else if (faction === 'Covenant') {
        color = 'bg-yellow-700';
        accent = 'bg-yellow-800';
    } else if (faction === 'Syndicate') {
        color = 'bg-purple-700'
        accent = 'bg-purple-800'
    }
    const label = isAttacker ? "Attacker" : "Defender"

    return (
        <div className={`${accent} rounded-lg`}>
            <div className="flex w-full text-white p-2 justify-center items-center drop-shadow-lg font-bold"> {isWinner && <CrownIcon weight={"fill"} className="text-yellow-500 drop-shadow-lg" />} {label}</div>
            <div className={`rounded-b-lg ${color} text-center text-white p-1`}>
                <div className="text-3xl font-bold drop-shadow-lg">
                    <Link to={`/companies/${summary.name}`}>
                        <span className="hover:underline">{summary.name}</span>
                    </Link>
                </div>
                <div className="drop-shadow-lg">{faction}</div>
                <div className="grid gap-4">
                    <div className="grid grid-cols-3 gap-1 drop-shadow-lg">
                        <StatWithIcon icon={<SwordIcon className="drop-shadow-lg" size={32} weight="fill" />} value={summary.kills} />
                        <StatWithIcon icon={<SkullIcon className="drop-shadow-lg" size={32} weight="fill" />} value={summary.deaths} />
                        <StatWithIcon icon={<HandshakeIcon className="drop-shadow-lg" size={32} weight="fill" />} value={summary.assists} />
                    </div>
                    <div className="grid grid-cols-2 gap-2 drop-shadow-lg">
                        <StatWithIcon icon={<FirstAidIcon className="drop-shadow-lg" size={32} weight="fill" />} value={<NumberCell className="drop-shadow-lg" value={summary.healing} />} />
                        <StatWithIcon icon={<FireIcon className="drop-shadow-lg" size={32} weight="fill" />} value={<NumberCell className="drop-shadow-lg" value={summary.damage} />} />
                    </div>
                </div>
            </div>
        </div >
    );
};

export default WarResultsCompany;
