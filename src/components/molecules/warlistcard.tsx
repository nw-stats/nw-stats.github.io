import { CrownIcon, ShieldIcon, SwordIcon } from "@phosphor-icons/react";
import type { War } from "../../types/war";
import { formatDate } from "../../utils/time";
import { Link } from "react-router-dom";

export interface WarListCardProp {
    war: War,
}
const WarListCard: React.FC<WarListCardProp> = ({ war }) => {
    const attackerWins = war.attacker === war.winner;
    const defenderWins = war.defender === war.winner;

    return (
        <Link to={`/wars/${war.id}`} className="w-full">
            <div className="bg-gray-800 rounded-lg w-full">
                <div className="grid grid-rows-[auto_1fr_auto] text-center text-gray-400">
                    <div className="pt-1 text-xs drop-shadow-lg">{war.map}</div>

                    <div className="grid grid-cols-3 place-items-center text-white font-bold relative">
                        <div className="relative flex items-center justify-center">
                            {attackerWins && (
                                <CrownIcon
                                    className="absolute -top-4 left-1/2 -translate-x-1/2 text-yellow-400"
                                    weight="fill"
                                    size={16}
                                />
                            )}
                            <span>{war.attacker}</span>
                        </div>

                        <div className="text-gray-400 font-normal">
                            <div className="relative flex items-center justify-center">
                                <SwordIcon className="absolute right-full mr-4 drop-shadow-fuchsia-500 drop-shadow-2xl" weight="fill" />
                                <span className="drop-shadow-lg">vs</span>
                                <ShieldIcon className="absolute left-full ml-4 drop-shadow-lg" weight="fill" />
                            </div>
                        </div>

                        <div className="relative flex items-center justify-center">
                            {defenderWins && (
                                <CrownIcon
                                    className="absolute -top-4 left-1/2 -translate-x-1/2 text-yellow-400"
                                    weight="fill"
                                    size={16}
                                />
                            )}
                            <span>{war.defender}</span>
                        </div>
                    </div>

                    <div className="pb-1 text-xs">{formatDate(war.date)}</div>
                </div>
            </div>
        </Link>
    );
    // return (
    //     <Link to={`/wars/${war.id}`}>
    //         <div className="bg-gray-800 rounded-lg p-4">
    //             <div className="grid grid-cols-3 w-full place-items-center">
    //                 <div className="grid grid-rows2 place-items-center">
    //                     {attackerWins ? (
    //                         <Crown weight="fill" className="text-yellow-400" />
    //                     ) : (
    //                         <Crown weight="fill" className="invisible" />
    //                     )}
    //                     <span className="font-bold">{war.attacker}</span>

    //                 </div>
    //                 <div className="flex flex-col w-full items-center justify-center text-center">
    //                     <span className="text-gray-500">vs</span>
    //                 </div>
    //                 <div className="grid grid-rows2 place-items-center">
    //                     {defenderWins ? (
    //                         <Crown weight="fill" className="text-yellow-400" />
    //                     ) : (
    //                         <Crown weight="fill" className="invisible" />
    //                     )}
    //                     <span className="font-bold">{war.defender}</span>
    //                 </div>
    //                 <div className="text-sm text-gray-400">
    //                     {formatDate(war.date)}
    //                 </div>
    //                 <div className="grid grid-cols-2 text-sm text-gray-400 text-nowrap">
    //                     {/* <div>{war.map}</div>
    //                 <div>{formatDate(war.date)}</div> */}
    //                 </div>
    //                 <div className="text-sm text-gray-400">
    //                     {war.map}
    //                 </div>
    //             </div>
    //         </div >
    //     </Link>
    // );
};

export default WarListCard;
