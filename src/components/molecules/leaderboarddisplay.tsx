import type { Leaderboard, LeaderboardEntry } from "../../types/leaderboard";
import React from 'react';
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    flexRender,
    type ColumnDef,
    type SortingState,
} from '@tanstack/react-table';

import NumberCell from "../atom/numbercell";
import LabelIcon from "../atom/labelicon";
import { Link } from "react-router-dom";
import { FireIcon, FirstAidIcon, HandshakeIcon, PercentIcon, PlusCircleIcon, SkullIcon, SwordIcon, UserListIcon, UsersThreeIcon } from "@phosphor-icons/react";
import type { Company } from "../../types/company";
import { factionBgSecondary, factionBgTertiary } from "../../utils/factions";
import { formatPercent } from "../../utils/format";
import Dropdown from "../atom/dropdown";
import { kRoles } from "../../types/role";

type LeaderboardProps = {
    leaderboard: Leaderboard,
    companies: Map<string, Company>,
};

const LeaderboardDisplay: React.FC<LeaderboardProps> = ({ leaderboard, companies }) => {
    const [selectedRole, setSelectedRole] = React.useState<string>('All Roles');
    const [sorting, setSorting] = React.useState<SortingState>([
        { id: 'score', desc: true },
    ]);

    const filtered = React.useMemo<LeaderboardEntry[]>(() => {
        return leaderboard.entries.filter(v => selectedRole === 'All Roles' || selectedRole === v.role);
    }, [selectedRole]);

    const columns = React.useMemo<ColumnDef<LeaderboardEntry>[]>(
        () => [
            {
                accessorKey: 'character',
                header: () => (<LabelIcon text={"Player"} icon={<UserListIcon weight="fill" />} />),
                cell: info => (
                    <div className="text-left hover:underline">
                        <Link to={`/players/${info.getValue<string>()}`}>
                            {info.getValue<string>()}
                        </Link>
                    </div>
                )
            },
            {
                accessorKey: 'role',
                header: () => (<LabelIcon text={"Role"} icon={<PlusCircleIcon weight="fill" />} />),
                cell: info => (
                    <div className="text-left">
                        {info.getValue<number>()}
                    </div>
                )
            },
            {
                accessorKey: 'company',
                header: () => (<LabelIcon text='Company' icon={<UsersThreeIcon weight="fill" />} />),
                cell: info => (
                    <div className="hover:underline">
                        <Link to={`/companies/${info.getValue<string>()}`}>
                            {info.getValue<string>()}
                        </Link>
                    </div>
                )
            },
            {
                accessorKey: 'score',
                header: () => (<LabelIcon text={'Score'} icon={<PlusCircleIcon weight="fill" />} />),
                cell: info => (
                    <div className="text-right">
                        <NumberCell value={info.getValue<number>()} />
                    </div>
                ),
            },
            {
                accessorKey: 'kills',
                header: () => <LabelIcon text='Kills' icon={<SwordIcon weight='fill' />} />,
                cell: info => (
                    <div className="text-right">
                        <NumberCell value={info.getValue<number>()} />
                    </div>
                ),
            },
            {
                accessorKey: 'deaths',
                header: () => {
                    return <LabelIcon text='Deaths' icon={<SkullIcon weight='fill' />} />;
                },
                cell: info => (
                    <div className="text-right">
                        <NumberCell value={info.getValue<number>()} />
                    </div>
                ),
            },
            {
                accessorKey: 'assists',
                header: () => <LabelIcon text='Assists' icon={<HandshakeIcon weight='fill' />} />,
                cell: info => (
                    <div className="text-right">
                        <NumberCell value={info.getValue<number>()} />
                    </div>
                ),
            },
            {
                accessorKey: 'healing',
                header: () => <LabelIcon text='Healing' icon={<FirstAidIcon weight='fill' />
                } />,
                cell: info => (
                    <div className="text-right">
                        <NumberCell value={info.getValue<number>()} />
                    </div>
                ),
            },
            {
                accessorKey: 'damage',
                header: () => <LabelIcon text='Damage' icon={<FireIcon weight='fill' />} />,
                cell: info => (
                    <div className="text-right">
                        <NumberCell value={info.getValue<number>()} />
                    </div>
                ),
            },
            {
                accessorKey: 'kpar',
                header: () => <LabelIcon text='KPAR' icon={<PercentIcon weight='fill' />} />,
                cell: info => (
                    <div className="text-right">
                        {formatPercent(info.getValue<number>())}
                    </div>
                ),
            },
        ],
        []
    );

    const table = useReactTable({
        data: filtered,
        columns,
        state: {
            sorting,
        },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    return (
        <div className="flex flex-col gap-2 bg-gray-800 rounded-lg shadow-lg text-white">
            <h2 className="text-xl font-bold p-2">Leaderboard</h2>
            <div className="pl-2">
                <Dropdown options={['All Roles', ...kRoles]} value={selectedRole} onChange={setSelectedRole} />
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full table-auto border-collapse">
                    <thead className="bg-gray-700" >
                        {
                            table.getHeaderGroups().map(headerGroup => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map(header => (
                                        <th
                                            key={header.id}
                                            colSpan={header.colSpan}
                                            onClick={header.column.getToggleSortingHandler()}
                                            className="cursor-pointer select-none p-2 border-b border-gray-600 text-left"
                                        >
                                            <div className="flex relative justify-center w-full items-center space-x-2">
                                                <span>
                                                    {flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                                </span>
                                                <span className="text-xs absolute right-0.5">
                                                    {{
                                                        asc: '▲',
                                                        desc: '▼',
                                                    }[header.column.getIsSorted() as string] ?? null}
                                                </span>
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            ))
                        }
                    </thead >
                    <tbody>
                        {table.getRowModel().rows.map((row, index) => {
                            const faction = companies.get(row.original.company)?.faction || 'Gray';

                            const rowClass = index % 2 === 0 ? factionBgSecondary(faction) : factionBgTertiary(faction);

                            return (
                                <tr key={row.id} className={rowClass}>
                                    {row.getVisibleCells().map(cell => (
                                        <td
                                            key={cell.id}
                                            className="p-3 border-b border-gray-700 text-sm text-nowrap"
                                        >
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            );
                        })}
                        {table.getRowModel().rows.length === 0 && (
                            <tr>
                                <td
                                    colSpan={columns.length}
                                    className="text-center p-4 text-gray-400"
                                >
                                    No data available
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div >
    );
};

export default LeaderboardDisplay
