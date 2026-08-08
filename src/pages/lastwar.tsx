import { useMemo, type JSX } from "react";
import NotFound from "./notfound";
import Loading from "../components/atom/loading";
import { useLastWar } from "../hooks/useLastWar";
import { flexRender, getCoreRowModel, getSortedRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table";
import type { PlayerLastWar } from "../types/lastWar";
import { kSheetIds } from "../constants/sheets";
import { useSeason } from "../hooks/base/useSeason";
import { Link } from "react-router-dom";

export default function LastWar(): JSX.Element {
    const { season } = useSeason();
    const { loading, error, lastWar } = useLastWar(kSheetIds[season]);

    const columns = useMemo<ColumnDef<PlayerLastWar>[]>(() => [
        {
            accessorKey: "name",
            header: "Player",
            cell: info => (
                <div className="text-foreground hover:underline">
                    <Link to={`/players/${info.getValue<string>()}`}>
                        {info.getValue<string>()}
                    </Link>
                </div>
            )
        },
        {
            accessorKey: "when",
            header: "Last War",
            sortingFn: (a, b) => a.original.when.toUnixInteger() - b.original.when.toUnixInteger(),
            cell: info => (
                <div className="text-foreground">
                    {info.getValue<luxon.DateTime>().toFormat("yyyy-MM-dd")}
                </div>
            )
        }
    ], []);

    const table = useReactTable({
        data: lastWar,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        initialState: { sorting: [{ id: "when", desc: false }] },
    });

    if (loading) return <Loading />;
    if (error) return <NotFound />;

    return (
        <div className="mx-auto max-w-4xl py-6">
            <div className="rounded-lg bg-background shadow-sm ring-1 ring-gray-700/50 overflow-hidden">

                <div className="border-b border-gray-700 px-4 py-3 text-sm font-semibold text-gray-300">
                    Last War Played
                </div>

                <table className="w-full border-collapse text-sm">
                    <thead className="bg-gray-900">
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <th
                                        key={header.id}
                                        className="px-4 py-2 text-left text-gray-400 font-medium"
                                    >
                                        {flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>

                    <tbody>
                        {table.getRowModel().rows.map(row => (
                            <tr
                                key={row.id}
                                className="border-t border-gray-700 hover:bg-surface/40"
                            >
                                {row.getVisibleCells().map(cell => (
                                    <td
                                        key={cell.id}
                                        className="px-4 py-2 text-muted"
                                    >
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
