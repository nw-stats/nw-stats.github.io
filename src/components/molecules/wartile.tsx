import { type JSX } from "react";
import type { War } from "../../types/war";
import { Link } from "react-router-dom";
import { formatDatetime } from "../../utils/time";

export interface WarTileProps {
    war: War;
}

function WarTile({ war }: WarTileProps): JSX.Element {
    return (
        <Link to={`/wars/${war.id}`}>
            <div className="bg-gray-800 text-white w-full h-full flex items-center justify-center rounded-lg p-2">
                <div className="text-center">
                    <div className="font-semibold">{war.attacker}</div>
                    <div className="text-sm text-gray-400">vs</div>
                    <div className="font-semibold">{war.defender}</div>
                    <div className="text-sm text-gray-400">{war.map}</div>
                    <div className="text-sm text-gray-400">{formatDatetime(war.date)}</div>
                </div>
                {/* <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-sm text-gray-400">
                <div className="text-sm text-gray-400">{war.map}</div>
            </div> */}
            </div>
        </Link>
    );
}


export default WarTile;
