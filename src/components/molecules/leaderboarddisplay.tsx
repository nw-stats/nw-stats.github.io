import type { LeaderboardEntry } from "../../types/leaderboard";
import { useMemo, useState, type JSX } from 'react';
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
import { FireIcon, FirstAidIcon, GameControllerIcon, HandshakeIcon, PercentIcon, PlusCircleIcon, SkullIcon, SwordIcon, UsersIcon } from "@phosphor-icons/react";
import type { Company } from "../../types/company";
import { factionBgSecondary, factionBgTertiary } from "../../utils/factions";
import { formatPercent } from "../../utils/format";
import Dropdown from "../atom/dropdown";
import { NoData } from "../atom/nodata";
import { kRoles, type Role } from "../../types/role";

type LeaderboardProps = {
    companies: Map<string, Company>,
    hideRoles: boolean,
    leaderboard?: LeaderboardEntry[],
};

export function LeaderboardDisplay({ leaderboard, companies, hideRoles }: LeaderboardProps): JSX.Element {
    const [selectedRole, setSelectedRole] = useState<string>('All Roles');
    const [sorting, setSorting] = useState<SortingState>([
        { id: 'score', desc: true },
    ]);

    const filtered = useMemo<LeaderboardEntry[]>(() => {
        if (leaderboard) {
            return leaderboard.filter(v => selectedRole === 'All Roles' || selectedRole === v.role);
        } else {
            return [];
        }
    }, [selectedRole]);

    const columns = useMemo<ColumnDef<LeaderboardEntry>[]>(() => {
        const baseCols: ColumnDef<LeaderboardEntry>[] = [
            {
                accessorKey: 'character',
                header: () => (<LabelIcon text={"Player"} icon={<UsersIcon weight="fill" />} />),
                cell: info => (
                    <div className="text-left hover:underline">
                        <Link to={`/players/${info.getValue<string>()}`}>
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
                header: () => <LabelIcon text='Deaths' icon={<SkullIcon weight='fill' />} />,
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
                header: () => <LabelIcon text='Healing' icon={<FirstAidIcon weight='fill' />} />,
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
        ];

        // Insert role column only if NOT hidden
        if (!hideRoles) {
            baseCols.splice(1, 0, {
                accessorKey: 'role',
                header: () => (
                    <LabelIcon text={'Role'} icon={<GameControllerIcon weight="fill" />} />
                ),
                sortingFn: (rowA, rowB) => {
                    const a = rowA.getValue<string>('role');
                    const b = rowB.getValue<string>('role');
                    const ai = kRoles.indexOf(a as Role);
                    const bi = kRoles.indexOf(b as Role);
                    return ai - bi;
                },
                cell: info => <>{info.getValue<string>()}</>,
            });
        }

        return baseCols;
    }, [hideRoles]);

    const roleOptions = useMemo(() => {
        const rolesSet = new Set<string>();
        if (leaderboard) {
            for (const entry of leaderboard) {
                if (entry.role !== '') {
                    rolesSet.add(entry.role as string);
                }
            }
        }
        return [...rolesSet].sort((a, b) => a.localeCompare(b));
    }, [leaderboard]);

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
                <Dropdown options={['All Roles', ...roleOptions]} value={selectedRole} onChange={setSelectedRole} />
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
                                    <NoData />
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
