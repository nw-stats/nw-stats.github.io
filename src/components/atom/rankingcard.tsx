import type { JSX } from "react";
import type { Faction } from "../../types/faction";
import { factionBgSecondary } from "../../utils/factions";

interface RankingCardProps {
    rank: number;
    name: string;
    faction: Faction;
    defWins: number;
    atkWins: number;
    defLoss: number;
    atkLoss: number;
}

function RankingCard({ rank, name, faction, defWins, atkWins, defLoss, atkLoss }: RankingCardProps): JSX.Element {
    const bgColor = factionBgSecondary(faction);
    return (
        <div className={`flex flex-row ${bgColor}`}>
            <div>
                {rank}
            </div>
            <div>
                {name}
            </div>
            <div>{defWins}</div>
            <div>{atkWins}</div>
            <div>{defLoss}</div>
            <div>{atkLoss}</div>
        </div >
    );
}

export default RankingCard;
