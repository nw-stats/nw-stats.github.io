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
            header: () => (<LabelIcon text={"Player"} icon={<UsersIcon weight="fill" />} />),
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
            header: () => <LabelIcon text='Group' icon={<UsersThreeIcon weight='fill' />} />,
            cell: info => info.getValue<string>(),
        },
        {
            accessorKey: "healing",
            header: () => <LabelIcon text='Healing' icon={<FirstAidIcon weight='fill' />} />,
            cell: info => (
                <div className="text-right">
                    <NumberCell value={info.getValue<number>()} />
                </div >
            ),
        },
        {
            accessorKey: "groupDeaths",
            header: () => <LabelIcon text='Deaths' icon={<SkullIcon weight='fill' />} />,
            cell: info => (
                <div className="text-right">
                    <NumberCell value={info.getValue<number>()} />
                </div >
            ),
        },
        {
            accessorKey: "qdpsDeaths",
            header: () => <LabelIcon text='Deaths' icon={<span>Q<SkullIcon weight='fill' /></span>} />,
            cell: info => (
                <div className="text-right">
                    <NumberCell value={info.getValue<number>()} />
                </div >
            ),
        },
    ]), []);

    return (
        <div className="grid grid-cols-2 gap-2">
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
