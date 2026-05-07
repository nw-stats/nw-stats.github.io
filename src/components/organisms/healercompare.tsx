import { useMemo, type JSX } from "react";
import type { HealerStats } from "../../types/healerstats";
import type { ColumnDef } from "@tanstack/react-table";
import StatsTable from "../atom/statstble";
import { Link } from "react-router-dom";
import NumberCell from "../atom/numbercell";
import { FirstAidIcon, SkullIcon, UsersIcon, UsersThreeIcon } from "@phosphor-icons/react";
import LabelIcon from "../atom/labelicon";
import { NoData } from "../atom/nodata";

interface HealerCompareProps {
    attackerName: string;
    defenderName: string;
    attackerHealers?: HealerStats[];
    defenderHealers?: HealerStats[];
}

export function HealerCompare({ attackerName, defenderName, attackerHealers, defenderHealers }: HealerCompareProps): JSX.Element {
    const healerStatsColumns: ColumnDef<HealerStats>[] = useMemo(() => ([
        {
            accessorKey: "character",
            size: 240,
            header: () => (
                <LabelIcon
                    text="Player"
                    icon={<UsersIcon weight="fill" />}
                />
            ),
            cell: info => (
                <div className="text-left hover:underline">
                    <Link to={`/players/${info.getValue<string>()}`}>
                        {info.getValue<string>()}
                    </Link>
                </div>
            ),
        },

        {
            accessorKey: "group",
            size: 80,
            header: () => (
                <LabelIcon
                    text="Group"
                    icon={<UsersThreeIcon weight="fill" />}
                />
            ),
            cell: info => (
                <div className="text-center">
                    {info.getValue<string>()}
                </div>
            ),
        },

        {
            accessorKey: "healing",
            size: 140,
            header: () => (
                <LabelIcon
                    text="Healing"
                    icon={<FirstAidIcon weight="fill" />}
                />
            ),
            cell: info => (
                <div className="text-right">
                    <NumberCell value={info.getValue<number>()} />
                </div>
            ),
        },

        {
            accessorKey: "healerDeaths",
            size: 110,
            header: () => (
                <div className="grid grid-cols-1">
                    Healer
                    <LabelIcon
                        text="Deaths"
                        icon={<SkullIcon weight="fill" />}
                    />
                </div>
            ),
            cell: info => (
                <div className="text-right">
                    <NumberCell value={info.getValue<number>()} />
                </div>
            ),
        },

        {
            accessorKey: "groupDeaths",
            size: 110,
            header: () => (
                <div className="grid grid-cols-1">
                    Group
                    <LabelIcon
                        text="Deaths"
                        icon={<SkullIcon weight="fill" />}
                    />
                </div>
            ),
            cell: info => (
                <div className="text-right">
                    <NumberCell value={info.getValue<number>()} />
                </div>
            ),
        },

        {
            accessorKey: "qdpsDeaths",
            size: 110,
            header: () => (
                <div className="grid grid-cols-1">
                    QDPS
                    <LabelIcon
                        text="Deaths"
                        icon={<SkullIcon weight="fill" />}
                    />
                </div>
            ),
            cell: info => (
                <div className="text-right">
                    <NumberCell value={info.getValue<number>()} />
                </div>
            ),
        },
    ]), []);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="bg-gray-700 rounded-lg">
                <h1 className="m-2 font-semibold">{attackerName}</h1>
                {attackerHealers ? (<StatsTable columns={healerStatsColumns} data={attackerHealers} />) : (<NoData />)}
            </div>
            <div className="bg-gray-700 rounded-lg">
                <h1 className="m-2 font-semibold">{defenderName}</h1>
                {defenderHealers ? (<StatsTable columns={healerStatsColumns} data={defenderHealers} />) : (<NoData />)}
            </div>
        </div>
    );
}
