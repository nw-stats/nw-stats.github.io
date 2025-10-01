import type { JSX } from "react";
import NumberCell from "../atom/numbercell";
import { FireIcon, FirstAidIcon, HandshakeIcon, ShieldIcon, SkullIcon, SwordIcon } from "@phosphor-icons/react";
import { factionBgPrimary, factionBgSecondary, factionBorder } from "../../utils/factions";
import { useMediaQuery } from "react-responsive";
import { Link } from "react-router-dom";
import FitTextToCell from "../atom/fittexttocell";
import type { Stats } from "../../types/stats";
import type { Company } from "../../types/company";

interface WarResultsSummaryProp {
    attacker: Company;
    defender: Company;
    attackerSummary: Stats | undefined;
    defenderSummary: Stats | undefined;
}

export function WarSummary({ attacker, defender, attackerSummary, defenderSummary }: WarResultsSummaryProp): JSX.Element {
    const attackerColor = factionBgPrimary(attacker.faction);
    const attackerAccent = factionBgSecondary(attacker.faction);
    const attackerBorder = factionBorder(attacker.faction);
    const defenderColor = factionBgPrimary(defender.faction);
    const defenderAccent = factionBgSecondary(defender.faction);
    const defenderBorder = factionBorder(defender.faction);

    // const isAttackerWinner = attackerSummary?.name === winner;
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
                        <div className={`${attackerColor} flex items-center justify-center font-bold  md:text-3xl p-2 w-full h-full border-b-2 ${attackerBorder} relative`}>
                            {/* {isAttackerWinner && <CrownIcon weight="fill" size={16} className="absolute top-0 left-1/2 -translate-x-1/2 translate-y-[1px] text-yellow-500 drop-shadow-lg" />} */}
                            <Link to={`/companies/${attacker}`}>
                                <span className="hover:underline"><FitTextToCell text={attacker.name} /></span>
                            </Link>
                        </div>
                        <div className="bg-gray-700 text-center text-3xl p-2 border-b-2 border-gray-900">vs</div>
                        <div className={`${defenderColor} flex items-center justify-center font-bold  md:text-3xl p-2 w-full h-full overflow-hidden ${defenderBorder} border-b-2 relative`}>
                            {/* {!isAttackerWinner &&
                                <CrownIcon
                                    weight="fill"
                                    size={16}
                                    className="absolute top-0 left-1/2 -translate-x-1/2 translate-y-[1px] text-yellow-500 drop-shadow-lg" />
                            } */}
                            <Link to={`/companies/${defender}`}>
                                <span className="hover:underline"><FitTextToCell text={defender.name} /></span>
                            </Link>
                        </div>
                    </div>

                    {/* Row 2: Kills */}
                    <div className="grid grid-cols-[1fr_50px_1fr] w-full items-center">
                        <div className={`${attackerColor} flex items-center justify-center font-semibold  p-2 w-full h-full ${attackerBorder} border-b-2`}>{<NumberCell value={attackerSummary?.kills ?? 0} />}</div>
                        <div className="bg-gray-700 w-full h-full flex items-center justify-center border-b-2 border-gray-900"><SwordIcon weight="fill" size={32} /></div>
                        <div className={`${defenderColor} flex items-center justify-center font-semibold  p-2 w-full h-full ${defenderBorder} border-b-2`}>{<NumberCell value={defenderSummary?.kills ?? 0} />}</div>
                    </div>

                    {/* Row 3: Deaths */}
                    <div className="grid grid-cols-[1fr_50px_1fr] w-full items-center">
                        <div className={`${attackerColor} flex items-center justify-center font-semibold  p-2 w-full h-full ${attackerBorder} border-b-2`}>{<NumberCell value={attackerSummary?.deaths ?? 0} />}</div>
                        <div className="bg-gray-700 w-full h-full flex items-center justify-center border-b-2 border-gray-900"><SkullIcon weight="fill" size={32} /></div>
                        <div className={`${defenderColor} flex items-center justify-center font-semibold  p-2 w-full h-full ${defenderBorder} border-b-2`}>{<NumberCell value={defenderSummary?.deaths ?? 0} />}</div>
                    </div>

                    {/* Row 4: Assists */}
                    <div className="grid grid-cols-[1fr_50px_1fr] w-full items-center">
                        <div className={`${attackerColor} flex items-center justify-center p-2 font-semibold  w-full h-full ${attackerBorder} border-b-2`}>{<NumberCell value={attackerSummary?.assists ?? 0} />}</div>
                        <div className="bg-gray-700 w-full h-full flex items-center justify-center border-b-2 border-gray-900"><HandshakeIcon weight="fill" size={32} /></div>
                        <div className={`${defenderColor} flex items-center justify-center p-2 font-semibold  w-full h-full ${defenderBorder} border-b-2`}>{<NumberCell value={defenderSummary?.assists ?? 0} />}</div>
                    </div>

                    {/* Row 5: Healing */}
                    <div className="grid grid-cols-[1fr_50px_1fr] w-full items-center">
                        <div className={`${attackerColor} flex items-center justify-center p-2 font-semibold  w-full h-full ${attackerBorder} border-b-2`}>{<NumberCell value={attackerSummary?.healing ?? 0} />}</div>
                        <div className="bg-gray-700 w-full h-full flex items-center justify-center border-b-2 border-gray-900"><FirstAidIcon weight="fill" size={32} /></div>
                        <div className={`${defenderColor} flex items-center justify-center p-2 font-semibold  w-full h-full ${defenderBorder} border-b-2`}>{<NumberCell value={defenderSummary?.healing ?? 0} />}</div>
                    </div>

                    {/* Row 6: Damage */}
                    <div className="grid grid-cols-[1fr_50px_1fr] w-full items-center">
                        <div className={`${attackerColor} rounded-bl-lg flex items-center justify-center p-2 font-semibold  w-full h-full`}>
                            <NumberCell value={attackerSummary?.damage ?? 0} />
                        </div>
                        <div className="bg-gray-700 w-full h-full flex items-center justify-center border-b-2 border-gray-900">
                            <FireIcon weight="fill" size={32} />
                        </div>
                        <div className={`${defenderColor} rounded-br-lg flex items-center justify-center p-2 font-semibold  w-full h-full`}>
                            <NumberCell value={defenderSummary?.damage ?? 0} />
                        </div>
                    </div>
                </div>
            </div >
        );
    }
    else {
        return (
            <table className="table-fixed border-collapse w-full  text-center text-white font-semibold rounded-lg overflow-hidden">
                <thead>
                    <tr className="bg-gray-700">
                        <th className="w-[4%] border-r-gray-900"></th>
                        <th className="w-[12%] border-r-gray-900"></th>
                        <th className="w-[12%] border-r-gray-900">
                            <div className="flex justify-center place-items-center h-full">
                                {/* <SwordIcon weight="fill" /> */}
                                Kills
                            </div>
                        </th>
                        <th className="w-[12%] border-r-gray-900">
                            <div className="flex justify-center place-items-center h-full">
                                {/* <SkullIcon weight="fill" /> */}
                                Deaths
                            </div>
                        </th>
                        <th className="w-[12%] border-r-gray-900">
                            <div className="flex justify-center place-items-center h-full">
                                {/* <HandshakeIcon weight="fill" /> */}
                                Assists
                            </div>
                        </th>
                        <th className="w-[12%] border-r-gray-900">
                            <div className="flex justify-center place-items-center h-full">
                                {/* <FirstAidIcon weight="fill" /> */}
                                Healing
                            </div>
                        </th>
                        <th className="w-[12%] border-r-gray-900">
                            <div className="flex justify-center place-items-center h-full">
                                {/* <FireIcon weight="fill" /> */}
                                Damage
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

                        <td className={`font-bold  ${attackerBorder} border-r-2 pt-4 pb-4`}>
                            <div className="flex w-full h-full items-center justify-center relative text-nowrap">
                                {/* {isAttackerWinner && <CrownIcon weight="fill" size={24} className="absolute -top-3 text-yellow-400 drop-shadow-lg" />} */}
                                <Link to={`/companies/${attacker}`}>
                                    <span className="hover:underline"><FitTextToCell text={attacker.name} /></span>
                                </Link>
                            </div>
                        </td>
                        <td className={`${attackerBorder} border-r-2`}>{<NumberCell value={attackerSummary?.kills ?? 0} />}</td>
                        <td className={`${attackerBorder} border-r-2`}>{<NumberCell value={attackerSummary?.deaths ?? 0} />}</td>
                        <td className={`${attackerBorder} border-r-2`}>{<NumberCell value={attackerSummary?.assists ?? 0} />}</td>
                        <td className={`${attackerBorder} border-r-2`}>{<NumberCell value={attackerSummary?.healing ?? 0} />}</td>
                        <td className={`${attackerBorder} border-r-2`}>{<NumberCell value={attackerSummary?.damage ?? 0} />}</td>
                    </tr>
                    <tr className={`${defenderColor} `}>
                        <td className={`${defenderAccent} ${defenderBorder} `}>
                            <div className="flex w-full h-full items-center justify-center">
                                <ShieldIcon />
                            </div>
                        </td>
                        <td className={`font-bold  ${defenderBorder} border-r-2 pt-4 pb-4`}>
                            <div className="flex w-full h-full items-center justify-center relative text-nowrap">
                                {/* {!isAttackerWinner && <CrownIcon weight="fill" size={24} className="absolute -top-3 text-yellow-400 drop-shadow-lg" />} */}
                                <Link to={`/companies/${defender}`}>
                                    <span className="hover:underline"><FitTextToCell text={defender.name} /></span>
                                </Link>
                            </div>
                        </td>
                        <td className={`${defenderBorder} border-r-2`}>{<NumberCell value={defenderSummary?.kills ?? 0} />}</td>
                        <td className={`${defenderBorder} border-r-2`}>{<NumberCell value={defenderSummary?.deaths ?? 0} />}</td>
                        <td className={`${defenderBorder} border-r-2`}>{<NumberCell value={defenderSummary?.assists ?? 0} />}</td>
                        <td className={`${defenderBorder} border-r-2`}>{<NumberCell value={defenderSummary?.healing ?? 0} />}</td>
                        <td className={`${defenderBorder} border-r-2`}>{<NumberCell value={defenderSummary?.damage ?? 0} />}</td>
                    </tr>
                </tbody>
            </table >
        );
    }

}
