import { CrownIcon, ShieldIcon, SwordIcon } from "@phosphor-icons/react";
import type { War } from "../../types/war";
import { formatDate, formatTime } from "../../utils/time";
import { Link } from "react-router-dom";

export interface WarListCardProp {
    war: War,
}
const WarListCard: React.FC<WarListCardProp> = ({ war }) => {
    const attackerWins = war.attacker === war.winner;
    const defenderWins = war.defender === war.winner;
    return (
        <Link to={`/wars/${war.id}`}>
            <div className="grid grid-cols-3 text-white w-full bg-gray-700 rounded-lg">
                {/* Attacker */}
                <div className="flex items-center justify-center h-full text-center font-semibold text-lg relative">
                    {attackerWins && (
                        <CrownIcon
                            className="absolute bottom-full left-1/2 -translate-x-1/2 -mb-8 text-yellow-400"
                            weight="fill"
                            size={16}
                        />
                    )}
                    <span>{war.attacker}</span>

                </div>

                {/* Middle column */}
                <div className="grid grid-rows-4 text-center text-gray-300">
                    <div>{war.map}</div>
                    <div className="flex items-center justify-center gap-2 text-gray-300 font-normal">
                        <SwordIcon className="drop-shadow-2xl" weight="fill" />
                        <span className="drop-shadow-lg align-middle">vs</span>
                        <ShieldIcon className="drop-shadow-lg" weight="fill" />
                    </div>
                    <div>{formatDate(war.date)}</div>
                    <div>{formatTime(war.date)}</div>
                </div>

                {/* Defender */}
                <div className="flex items-center justify-center h-full text-center font-semibold text-lg relative">
                    {defenderWins && (
                        <CrownIcon
                            className="absolute bottom-full left-1/2 -translate-x-1/2 -mb-8 text-yellow-400"
                            weight="fill"
                            size={16}
                        />
                    )}
                    <span>{war.defender}</span>
                </div>
            </div>
        </Link>

    );
    // return (
    //     <Link to={`/wars/${war.id}`} className="block">
    //         <div className="bg-gray-800 rounded-lg w-full">
    //             <div className="grid grid-rows-[auto_1fr_auto] text-center text-gray-200">
    //                 <div className="pt-1 text-xs drop-shadow-lg">{war.map}</div>

    //                 <div className="grid grid-cols-3 place-items-center text-white font-bold relative">
    //                     <div className="relative flex items-center justify-center">
    //                         {attackerWins && (
    //                             <CrownIcon
    //                                 className="absolute -top-4 left-1/2 -translate-x-1/2 text-yellow-400"
    //                                 weight="fill"
    //                                 size={16}
    //                             />
    //                         )}
    //                         <span className="drop">{war.attacker}</span>
    //                     </div>

    //                     <div className="text-gray-300 font-normal">
    //                         <div className="relative flex items-center justify-center">
    //                             <SwordIcon className="absolute right-full mr-4 drop-shadow-2xl" weight="fill" />
    //                             <span className="drop-shadow-lg">vs</span>
    //                             <ShieldIcon className="absolute left-full ml-4 drop-shadow-lg" weight="fill" />
    //                         </div>
    //                     </div>

    //                     <div className="relative flex items-center justify-center">
    //                         {defenderWins && (
    //                             <CrownIcon
    //                                 className="absolute -top-4 left-1/2 -translate-x-1/2 text-yellow-400"
    //                                 weight="fill"
    //                                 size={16}
    //                             />
    //                         )}
    //                         <span>{war.defender}</span>
    //                     </div>
    //                 </div>

    //                 <div className="pb-1 text-xs">{formatDate(war.date)}</div>
    //                 <div className="pb-1 text-xs">{formatTime(war.date)}</div>
    //             </div>
    //         </div>
    //     </Link>
    // );

    // return (
    //     <div className="bg-gray-700 w-full hover:bg-fuchsia-200">
    //         Hello world
    //     </div>
    // );
};



export default WarListCard;
