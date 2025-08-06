import type { JSX } from "react";
import type { Faction } from "../../types/faction";
import type { StatTotals } from "../../types/leaderboard";
import NumberCell from "../atom/numbercell";
import { CrownIcon, FireIcon, FirstAidIcon, HandshakeIcon, ShieldIcon, SkullIcon, SwordIcon } from "@phosphor-icons/react";
import { factionBgPrimary, factionBgSecondary, factionBorder } from "../../utils/factions";
import { useMediaQuery } from "react-responsive";
import { Link } from "react-router-dom";
import FitTextToCell from "../atom/fittexttocell";

interface WarResultsSummaryProp {
    summaries: StatTotals[],
    factions: Faction[],
    attacker: string,
    winner: string
}

function WarResultsCompanyCombined({ summaries, factions, winner }: WarResultsSummaryProp): JSX.Element {

    let attackerColor = factionBgPrimary(factions[0]);
    let attackerAccent = factionBgSecondary(factions[0]);
    let attackerBorder = factionBorder(factions[0]);
    let defenderColor = factionBgPrimary(factions[1]);
    let defenderAccent = factionBgSecondary(factions[1]);
    let defenderBorder = factionBorder(factions[1]);

    const isAttackerWinner = summaries[0].name === winner;
    const isSmall = useMediaQuery({ maxWidth: 768 })

    if (isSmall) {
        return (
            <div className="grid grid-rows w-full text-white mx-auto">
                <div className="grid grid-cols-[1fr_50px_1fr] w-full items-center place-items-center">
                    <div className={`flex w-full ${attackerAccent} rounded-tl-lg w-full h-fit justify-center text-center font-bold`}>
                        Attacker
                    </div >
                    <div className="bg-gray-700 w-full h-full"></div>
                    <div className={`flex w-full ${defenderAccent} rounded-tr-lg w-full h-fit justify-center font-bold`}>
                        Defender
                    </div>
                </div>
                <div className="grid grid-rows-7 w-full text-white mx-auto">
                    {/* Row 1: Names */}
                    <div className="grid grid-cols-[1fr_50px_1fr] w-full items-center">
                        <div className={`${attackerColor} flex items-center justify-center font-bold text-xl md:text-3xl p-2 w-full h-full border-b-2 ${attackerBorder} relative`}>
                            {isAttackerWinner && <CrownIcon weight="fill" size={16} className="absolute top-0 left-1/2 -translate-x-1/2 translate-y-[1px] text-yellow-500 drop-shadow-lg" />}
                            <Link to={`/companies/${summaries[0].name}`}>
                                <span className="hover:underline"><FitTextToCell text={summaries[0].name} /></span>
                            </Link>
                        </div>
                        <div className="bg-gray-700 text-center text-3xl p-2 border-b-2 border-gray-900">vs</div>
                        <div className={`${defenderColor} flex items-center justify-center font-bold text-xl md:text-3xl p-2 w-full h-full overflow-hidden ${defenderBorder} border-b-2 relative`}>
                            {!isAttackerWinner &&
                                <CrownIcon
                                    weight="fill"
                                    size={16}
                                    className="absolute top-0 left-1/2 -translate-x-1/2 translate-y-[1px] text-yellow-500 drop-shadow-lg" />
                            }
                            <Link to={`/companies/${summaries[0].name}`}>
                                <span className="hover:underline"><FitTextToCell text={summaries[1].name} /></span>
                            </Link>
                        </div>
                    </div>

                    {/* Row 2: Kills */}
                    <div className="grid grid-cols-[1fr_50px_1fr] w-full items-center">
                        <div className={`${attackerColor} flex items-center justify-center font-semibold text-xl p-2 w-full h-full ${attackerBorder} border-b-2`}>{<NumberCell value={summaries[0].kills} />}</div>
                        <div className="bg-gray-700 w-full h-full flex items-center justify-center border-b-2 border-gray-900"><SwordIcon weight="fill" size={32} /></div>
                        <div className={`${defenderColor} flex items-center justify-center font-semibold text-xl p-2 w-full h-full ${defenderBorder} border-b-2`}>{<NumberCell value={summaries[1].kills} />}</div>
                    </div>

                    {/* Row 3: Deaths */}
                    <div className="grid grid-cols-[1fr_50px_1fr] w-full items-center">
                        <div className={`${attackerColor} flex items-center justify-center font-semibold text-xl p-2 w-full h-full ${attackerBorder} border-b-2`}>{<NumberCell value={summaries[0].deaths} />}</div>
                        <div className="bg-gray-700 w-full h-full flex items-center justify-center border-b-2 border-gray-900"><SkullIcon weight="fill" size={32} /></div>
                        <div className={`${defenderColor} flex items-center justify-center font-semibold text-xl p-2 w-full h-full ${defenderBorder} border-b-2`}>{<NumberCell value={summaries[1].deaths} />}</div>
                    </div>

                    {/* Row 4: Assists */}
                    <div className="grid grid-cols-[1fr_50px_1fr] w-full items-center">
                        <div className={`${attackerColor} flex items-center justify-center p-2 font-semibold text-xl w-full h-full ${attackerBorder} border-b-2`}>{<NumberCell value={summaries[0].assists} />}</div>
                        <div className="bg-gray-700 w-full h-full flex items-center justify-center border-b-2 border-gray-900"><HandshakeIcon weight="fill" size={32} /></div>
                        <div className={`${defenderColor} flex items-center justify-center p-2 font-semibold text-xl w-full h-full ${defenderBorder} border-b-2`}>{<NumberCell value={summaries[1].assists} />}</div>
                    </div>

                    {/* Row 5: Healing */}
                    <div className="grid grid-cols-[1fr_50px_1fr] w-full items-center">
                        <div className={`${attackerColor} flex items-center justify-center p-2 font-semibold text-xl w-full h-full ${attackerBorder} border-b-2`}>{<NumberCell value={summaries[0].healing} />}</div>
                        <div className="bg-gray-700 w-full h-full flex items-center justify-center border-b-2 border-gray-900"><FirstAidIcon weight="fill" size={32} /></div>
                        <div className={`${defenderColor} flex items-center justify-center p-2 font-semibold text-xl w-full h-full ${defenderBorder} border-b-2`}>{<NumberCell value={summaries[1].healing} />}</div>
                    </div>

                    {/* Row 6: Damage */}
                    <div className="grid grid-cols-[1fr_50px_1fr] w-full items-center">
                        <div className={`${attackerColor} rounded-bl-lg flex items-center justify-center p-2 font-semibold text-xl w-full h-full`}>
                            <NumberCell value={summaries[0].damage} />
                        </div>
                        <div className="bg-gray-700 w-full h-full flex items-center justify-center border-b-2 border-gray-900">
                            <FireIcon weight="fill" size={32} />
                        </div>
                        <div className={`${defenderColor} rounded-br-lg flex items-center justify-center p-2 font-semibold text-xl w-full h-full`}>
                            <NumberCell value={summaries[1].damage} />
                        </div>
                    </div>
                </div>
            </div >
        );
    }
    else {
        return (
            <table className="table-fixed border-collapse w-full h-full text-2xl text-center text-gray-200 rounded-lg overflow-hidden">
                <thead>
                    <tr className="bg-gray-700">
                        <th className="w-[4%] border-r-gray-900"></th>
                        <th className="w-[12%] border-r-gray-900"></th>
                        <th className="w-[12%] border-r-gray-900">
                            <div className="flex justify-center place-items-center h-full">
                                <SwordIcon weight="fill" />
                            </div>
                        </th>
                        <th className="w-[12%] border-r-gray-900">
                            <div className="flex justify-center place-items-center h-full">
                                <SkullIcon weight="fill" />
                            </div>
                        </th>
                        <th className="w-[12%] border-r-gray-900">
                            <div className="flex justify-center place-items-center h-full">
                                <HandshakeIcon weight="fill" />
                            </div>
                        </th>
                        <th className="w-[12%] border-r-gray-900">
                            <div className="flex justify-center place-items-center h-full">
                                <FirstAidIcon weight="fill" />
                            </div>
                        </th>
                        <th className="w-[12%] border-r-gray-900">
                            <div className="flex justify-center place-items-center h-full">
                                <FireIcon weight="fill" />
                            </div>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr className={`${attackerColor} `}>
                        <td className={`${attackerAccent} ${attackerBorder} `}>
                            <div className="flex w-full h-full items-center justify-center">
                                <SwordIcon />
                            </div>
                        </td>

                        <td className={`font-bold text-2xl ${attackerBorder} border-r-2 pt-4 pb-4`}>
                            <div className="flex w-full h-full items-center justify-center relative text-nowrap">
                                {isAttackerWinner && <CrownIcon weight="fill" size={24} className="absolute -top-3 text-yellow-400 drop-shadow-lg" />}
                                <Link to={`/companies/${summaries[0].name}`}>
                                    <span className="hover:underline"><FitTextToCell text={summaries[0].name} /></span>
                                </Link>
                            </div>
                        </td>
                        <td className={`${attackerBorder} border-r-2`}>{<NumberCell value={summaries[0].kills} />}</td>
                        <td className={`${attackerBorder} border-r-2`}>{<NumberCell value={summaries[0].deaths} />}</td>
                        <td className={`${attackerBorder} border-r-2`}>{<NumberCell value={summaries[0].assists} />}</td>
                        <td className={`${attackerBorder} border-r-2`}>{<NumberCell value={summaries[0].healing} />}</td>
                        <td className={`${attackerBorder} border-r-2`}>{<NumberCell value={summaries[0].damage} />}</td>
                    </tr>
                    <tr className={`${defenderColor} `}>
                        <td className={`${defenderAccent} ${defenderBorder} `}>
                            <div className="flex w-full h-full items-center justify-center">
                                <ShieldIcon />
                            </div>
                        </td>
                        <td className={`font-bold text-2xl ${defenderBorder} border-r-2 pt-4 pb-4`}>
                            <div className="flex w-full h-full items-center justify-center relative text-nowrap">
                                {!isAttackerWinner && <CrownIcon weight="fill" size={24} className="absolute -top-3 text-yellow-400 drop-shadow-lg" />}
                                <Link to={`/companies/${summaries[1].name}`}>
                                    <span className="hover:underline"><FitTextToCell text={summaries[1].name} /></span>
                                </Link>
                            </div>
                        </td>
                        <td className={`${defenderBorder} border-r-2`}>{<NumberCell value={summaries[1].kills} />}</td>
                        <td className={`${defenderBorder} border-r-2`}>{<NumberCell value={summaries[1].deaths} />}</td>
                        <td className={`${defenderBorder} border-r-2`}>{<NumberCell value={summaries[1].assists} />}</td>
                        <td className={`${defenderBorder} border-r-2`}>{<NumberCell value={summaries[1].healing} />}</td>
                        <td className={`${defenderBorder} border-r-2`}>{<NumberCell value={summaries[1].damage} />}</td>
                    </tr>
                </tbody>
            </table >
        );
    }

}

export default WarResultsCompanyCombined;
