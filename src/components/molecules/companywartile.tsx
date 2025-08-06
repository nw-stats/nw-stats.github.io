import type { JSX } from "react";
import type { War } from "../../types/war";
import { Link } from "react-router-dom";

interface CompanyWarTileProps {
    companyName: string
    war: War
}

function CompanyWarTile({ companyName, war }: CompanyWarTileProps): JSX.Element {
    // const isWinner = war.winner === companyName;
    const opponent = war.attacker === companyName ? war.defender : war.attacker;
    return (
        <Link to={`/wars/${war.id}`} className="h-full w-full">
            <div className="text-white bg-gray-700 rounded-lg">
                <div className="flex w-full h-full justify-center items-center">
                    <div className="flex flex-col items-center">
                        <div>vs</div>
                        <div>{opponent}</div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
export default CompanyWarTile;
