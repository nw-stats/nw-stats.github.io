import { flexRender, getCoreRowModel, getSortedRowModel, useReactTable, type ColumnDef, type SortingState } from "@tanstack/react-table";
import { useMemo, useState, type JSX } from "react";
import type { WinLoss } from "../../types/ranking";
import LabelIcon from "../atom/labelicon";
import { ListNumbersIcon, ThumbsDownIcon, ThumbsUpIcon, UsersThreeIcon } from "@phosphor-icons/react";
import { Link } from "react-router-dom";

import { factionBgSecondary, factionBgTertiary } from "../../utils/factions";

interface RankingsDisplayProps {
    rankings: WinLoss[];
}

function RankingsDisplay({ rankings }: RankingsDisplayProps): JSX.Element {
    const [sorting, setSorting] = useState<SortingState>([{ id: "rank", desc: true }]);

    const columns = useMemo<ColumnDef<WinLoss>[]>(() => [
        {
            id: "rank",
            header: ({ column }) => (
                <div className="w-32 text-center">
                    <button onClick={() => column.toggleSorting()} className="flex items-center gap-1 justify-center w-full">
                        <LabelIcon icon={<ListNumbersIcon weight="fill" />} text="Rank" /></button>
                </div>
            ),
            accessorFn: row => row.attackWins + row.defenseWins - row.attackLoss - row.defenseLoss,
            sortingFn: "basic",
            cell: info => (
                <div className="w-32 text-center font-bold text-lg">{info.row.index + 1}</div>
            ),
        },
        {
            accessorKey: "name",
            id: "company",
            header: ({ column }) => (
                <div className="text-left w-full">
                    <button onClick={() => column.toggleSorting()}>
                        <LabelIcon icon={<UsersThreeIcon weight="fill" />} text="Company" />
                    </button>

                </div>
            ),
            cell: ({ row }) => {
                const data = row.original;
                return (
                    <Link to={`/companies/${data.name}`} className="block w-full text-left">
                        <span className="hover:underline text-white font-semibold text-xl truncate">
                            {data.name}
                        </span>
                    </Link>
                );
            },
        },
        {
            id: "wins",
            header: ({ column }) => (
                <div className="w-32 text-center">
                    <button onClick={() => column.toggleSorting()} className="flex items-center gap-1 justify-center w-full">
                        <LabelIcon icon={<ThumbsUpIcon weight="fill" />} text="Wins" />
                    </button>
                </div>
            ),
            accessorFn: item => item.attackWins + item.defenseWins,
            sortingFn: "basic",
            cell: info => (
                <div className="w-32 text-center font-semibold text-green-300">
                    {info.getValue<number>()}
                </div>
            ),
        },
        {
            id: "losses",
            header: ({ column }) => (
                <div className="w-32 text-center">
                    <button onClick={() => column.toggleSorting()} className="flex items-center gap-1 justify-center w-full">
                        <LabelIcon icon={<ThumbsDownIcon />} text="Losses" />
                    </button>
                </div>
            ),
            accessorFn: item => item.attackLoss + item.defenseLoss,
            sortingFn: "basic",
            cell: info => (
                <div className="w-32 text-center font-semibold text-red-300">
                    {info.getValue<number>()}
                </div>
            ),
        },
    ], [rankings]);

    const table = useReactTable({
        data: rankings,
        columns,
        state: { sorting },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    return (
        <div className="w-full text-white">
            <table className="w-full table-fixed border-collapse text-sm">
                <thead className="bg-gray-700 text-white">
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => {
                                // Determine width classes based on column id
                                let widthClass = "";
                                if (header.column.id === "rank") widthClass = "w-32";
                                else if (header.column.id === "wins" || header.column.id === "losses") widthClass = "w-32";
                                else if (header.column.id === "company") widthClass = "w-auto"; // stretch

                                return (
                                    <th
                                        key={header.id}
                                        className={`${widthClass} cursor-pointer select-none p-2 border-b border-gray-600 text-center relative pr-6`} // pr-6 for space on right
                                    >
                                        <div>
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                        </div>
                                        <span className="text-xs top-1/2 -translate-y-1/2 right-1 absolute pointer-events-none">
                                            {{
                                                asc: "▲",
                                                desc: "▼"
                                            }[header.column.getIsSorted() as string] ?? "-"}
                                        </span>
                                    </th>
                                );
                            })}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map((row, index) => {
                        const rowClass = index % 2 === 0
                            ? factionBgSecondary("Gray")
                            : factionBgTertiary("Gray");
                        return (
                            <tr key={row.id} className={rowClass}>
                                {row.getVisibleCells().map(cell => {
                                    let widthClass = "";
                                    if (cell.column.id === "rank") widthClass = "w-32 text-center";
                                    else if (cell.column.id === "wins" || cell.column.id === "losses") widthClass = "w-32 text-center";
                                    else if (cell.column.id === "company") widthClass = "w-auto text-left";

                                    return (
                                        <td
                                            key={cell.id}
                                            className={`p-3 border-b border-gray-700 align-middle ${widthClass}`}
                                        >
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    );
                                })}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

export default RankingsDisplay;
