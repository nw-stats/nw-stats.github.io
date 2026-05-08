import { useMemo, type JSX } from "react";
import NotFound from "./notfound";
import Loading from "../components/atom/loading";
import { useGroupless } from "../hooks/useGroupless";
import { flexRender, getCoreRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table";
import type { Ungrouped } from "../types/ungrouped";

export default function Groupless(): JSX.Element {
    const { loading, error, groupless } = useGroupless();

    const columns = useMemo<ColumnDef<Ungrouped>[]>(() => [
        {
            accessorKey: "character",
            header: "Character",
            cell: info => (
                <div className="text-foreground">
                    {info.getValue<string>()}
                </div>
            )
        },
        {
            accessorKey: 'warid',
            cell: info => (
                <div className="text-foreground">
                    {info.getValue<string>()}
                </div>
            )
        }
    ], []);

    const table = useReactTable({
        data: groupless ?? [],
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    if (loading) return <Loading />;
    if (error) return <NotFound />;

    return (
        <div className="mx-auto max-w-4xl py-6">
            <div className="rounded-lg bg-background shadow-sm ring-1 ring-gray-700/50 overflow-hidden">

                {/* Header */}
                <div className="border-b border-gray-700 px-4 py-3 text-sm font-semibold text-gray-300">
                    Groupless Characters
                </div>

                {/* Table */}
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
                                className="border-t border-gray-700 hover:bg-card/40"
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
