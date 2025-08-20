import { CrownIcon, ShieldIcon, SwordIcon } from "@phosphor-icons/react";
import type { War } from "../../types/war";
import { formatDate, formatTime } from "../../utils/time";
import { Link } from "react-router-dom";
import { factionBgPrimary } from "../../utils/factions";

export interface WarListCardProp {
    war: War,
}
const WarListCard: React.FC<WarListCardProp> = ({ war }) => {
    const attackerWins = war.attacker.name === war.winner;
    const defenderWins = war.defender.name === war.winner;

    const attackerColor = factionBgPrimary(war.attacker.faction);
    const defenderColor = factionBgPrimary(war.defender.faction);
    return (
        <Link to={`/wars/${war.id}`}>
            <div className="grid grid-cols-3 bg-gray-700 text-white rounded-lg">
                {/* Attacker */}
                <div className={`flex items-center justify-center h-full text-center font-semibold text-lg relative`}>
                    <div className={`absolute inset-0 ${attackerColor} w-1/12 rounded-l-lg`}></div>
                    {attackerWins && (
                        <CrownIcon
                            className="absolute bottom-full left-1/2 -translate-x-1/2 -mb-8 text-yellow-400"
                            weight="fill"
                            size={16}
                        />
                    )}

                    <span className="relative">{war.attacker.name}</span>
                </div>

                <div className="flex flex-col items-center justify-center text-center h-full py-2">
                    <span className="text-sm text-gray-200">
                        <span className="hidden sm:block">
                            {formatDate(war.date)} • {formatTime(war.date)}
                        </span>
                        <span className="flex flex-col sm:hidden">
                            <span>
                                {formatDate(war.date)}
                            </span>
                            <span>
                                {formatTime(war.date)}
                            </span>
                        </span>
                    </span>
                    <span className="flex flex-row items-center font-extrabold text-gray-200 gap-1">
                        <SwordIcon weight="fill" size={16} />
                        <span>VS</span>
                        <ShieldIcon weight="fill" size={16} />
                    </span>
                    <span className="text-sm text-gray-400">
                        <span className="hidden sm:block">
                            {war.map} • {war.server}
                        </span>
                        <span className="flex flex-col sm:hidden">
                            <span>
                                {war.map}
                            </span>
                            <span>
                                {war.server}
                            </span>
                        </span>
                    </span>
                </div>


                {/* Defender */}
                <div className={`flex items-center justify-center h-full text-center font-semibold text-lg relative`}>
                    <div className={`absolute right-0 top-0 h-full w-1/12 ${defenderColor} rounded-r-lg`} />                    {defenderWins && (
                        <CrownIcon
                            className="absolute bottom-full left-1/2 -translate-x-1/2 -mb-8 text-yellow-400"
                            weight="fill"
                            size={16}
                        />
                    )}
                    <span className="relative">{war.defender.name}</span>
                </div>
            </div>
        </Link >

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
