import { CrownIcon, ShieldIcon, SwordIcon } from "@phosphor-icons/react";
import { formatDate, formatTime } from "../../utils/time";
import { Link } from "react-router-dom";
import { factionBgPrimary } from "../../utils/factions";
import type { JSX } from "react";
import { Skeleton } from "../atom/skeleton";
import type { War } from "../../types/war";

export interface WarListCardProp {
    war: War,
}
export function WarListCard({ war }: WarListCardProp): JSX.Element {
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
                            {war.territory} • {war.server}
                        </span>
                        <span className="flex flex-col sm:hidden">
                            <span>
                                {war.territory}
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
}

export function WarListCardSkeleton(): JSX.Element {
    return (
        <div className="grid grid-cols-3 bg-gray-700 text-white rounded-lg overflow-hidden animate-pulse">
            {/* Attacker */}
            <div className="flex items-center justify-center h-full text-center font-semibold text-lg relative">
                <div className="absolute inset-0 bg-gray-600 w-1/12 rounded-l-lg" />
                <Skeleton className="h-5 w-24 rounded-md" />
            </div>

            {/* Center */}
            <div className="flex flex-col items-center justify-center text-center h-full py-2 gap-2">
                <Skeleton className="h-4 w-40 rounded-md" /> {/* date + time */}
                <div className="flex flex-row items-center font-extrabold gap-1">
                    <Skeleton className="h-4 w-4 rounded-full" />
                    <Skeleton className="h-4 w-6 rounded-md" />
                    <Skeleton className="h-4 w-4 rounded-full" />
                </div>
                <Skeleton className="h-4 w-32 rounded-md" /> {/* map + server */}
            </div>

            {/* Defender */}
            <div className="flex items-center justify-center h-full text-center font-semibold text-lg relative">
                <div className="absolute right-0 top-0 h-full w-1/12 bg-gray-600 rounded-r-lg" />
                <Skeleton className="h-5 w-24 rounded-md" />
            </div>
        </div>
    );
}
