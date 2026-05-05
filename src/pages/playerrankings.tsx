import { useMemo, useState, type JSX } from "react";
import { useCharacterRankings } from "../hooks/useCharacterRankings";
import NotFound from "./notfound";
import Loading from "../components/atom/loading";
import { factionBgSecondary, factionBgTertiary } from "../utils/factions";
import { type ColumnDef, getCoreRowModel, getSortedRowModel, useReactTable, type SortingState, flexRender } from "@tanstack/react-table";
import LabelIcon from "../components/atom/labelicon";
import { FireIcon, FirstAidIcon, HandshakeIcon, PercentIcon, PlusCircleIcon, SkullIcon, SwordIcon, UsersIcon, UsersThreeIcon } from "@phosphor-icons/react";
import { formatPercent } from "../utils/format";
import NumberCell from "../components/atom/numbercell";
import { Link, useSearchParams } from "react-router-dom";
import type { PlayerRolePerformance } from "../types/characterperformance";
import { sortRolesStrings } from "../utils/roster";
import Dropdown from "../components/atom/dropdown";

export default function PlayerRankings(): JSX.Element {
    const { loading, error, rankings } = useCharacterRankings();
    const [searchParams, setSearchParams] = useSearchParams();

    const selectedRole = searchParams.get("role") ?? "All Roles";
    const setSelectedRole = (role: string) => {
        setSearchParams(prev => {
            const next = new URLSearchParams(prev);
            next.set("role", role);
            return next;
        });
    };

    const sorting: SortingState = useMemo(() => {
        const sortParam = searchParams.get("sort");
        if (!sortParam) return [{ id: "score", desc: true }];

        const [id, dir] = sortParam.split("_");

        return [
            {
                id,
                desc: dir === "desc",
            },
        ];
    }, [searchParams]);
    const setSorting = (updater: SortingState | ((old: SortingState) => SortingState)) => {
        const nextSorting =
            typeof updater === "function" ? updater(sorting) : updater;

        const next = new URLSearchParams(searchParams);

        if (!nextSorting.length) {
            next.delete("sort");
        } else {
            const { id, desc } = nextSorting[0];
            next.set("sort", `${id}_${desc ? "desc" : "asc"}`);
        }

        setSearchParams(next);
    };


    const filtered = useMemo(() => {
        if (rankings) {
            return rankings.filter(v => selectedRole === 'All Roles' || selectedRole === v.role.role);
        } else {
            return [];
        }
    }, [selectedRole, rankings]);

    const columns = useMemo<ColumnDef<PlayerRolePerformance>[]>(() => {
        const baseCols: ColumnDef<PlayerRolePerformance>[] = [
            {
                accessorKey: 'name',
                header: () => (<LabelIcon text={"Player"} icon={<UsersIcon weight="fill" />} />),
                sortingFn: 'basic',
                cell: info => (
                    <div className="text-left hover:underline">
                        <Link to={`/players/${info.getValue<string>()}`}>
                            {info.getValue<string>()}
                        </Link>
                    </div>
                )
            },
            {
                id: 'role',
                accessorFn: (row) => row.role.role,
                header: () => (<LabelIcon text='Role' icon={<UsersThreeIcon weight="fill" />} />),
                cell: info => (
                    <div>
                        {info.getValue<string>()}
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

        return baseCols;
    }, []);

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

    const roleOptions = useMemo(() => {
        const roleSet = new Set<string>();
        if (rankings) {
            for (const row of rankings) {
                if (row.role.role) {
                    roleSet.add(row.role.role);
                }
            }
        }
        return [...roleSet].sort(sortRolesStrings);
    }, [rankings]);

    if (error) return <NotFound />;
    if (loading) return <Loading />;

    return (
        <div className="flex flex-col pt-8 max-w-6xl mx-auto text-white">
            <div className="w-full pt-8 max-w-6xl mx-auto gap-4">
                <div className="bg-gray-800 rounded-t-lg">
                    <h1 className="text-white font-semibold text-xl p-2">Character Totals</h1>
                    <div className="pl-2">
                        <Dropdown options={['All Roles', ...roleOptions]} value={selectedRole} onChange={setSelectedRole} />
                    </div>
                </div>
            </div >

            <div className="w-full text-white bg-gray-800 " >
                <table className="w-full table-fixed border-collapse text-sm">
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
                            const faction = 'Gray';
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
                    </tbody>
                </table>
            </div>

            {rankings.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                    No rankings data available yet.
                </div>
            )}
        </div>
    );
}
