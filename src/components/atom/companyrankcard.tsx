import type { JSX } from "react";
import type { Faction } from "../../types/faction";
import { Link } from "react-router-dom";
import { factionBgPrimary } from "../../utils/factions";

interface CompanyRankCardProps {
    name: string;
    faction: Faction;
}

function CompanyRankCard({ name, faction }: CompanyRankCardProps): JSX.Element {
    const color = factionBgPrimary(faction);
    return (
        <Link to={`/companies/${name}`}>
            <div className="flex bg-gray-800 gap-1 hover:scale-105 rounded-lg">
                <div className={`${color} rounded-l-lg p-4`}>

                </div>
                <div className="flex-col gap-1 p-2">
                    <div>
                        {name}
                    </div>
                    <div className="text-xs text-gray-200">
                        {faction}
                    </div>
                </div>
            </div>
        </Link >
    );
}

export default CompanyRankCard;
