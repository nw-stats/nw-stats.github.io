import type { JSX } from "react";
import Loading from "../components/atom/loading";
import NotFound from "./notfound";
import { useOrphanedCharacters } from "../hooks/useOrphanedCharacters";
import { flexRender, getCoreRowModel, getSortedRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table";
import { factionBgSecondary, factionBgTertiary } from "../utils/factions";

export function OrphanedCharacters(): JSX.Element {
    const { loading: lbLoading, error: lbError, orphans } = useOrphanedCharacters();

    const columns: ColumnDef<string>[] = [
        {
            id: "name",
            accessorFn: (row) => row,
            header: "Character",
            cell: info => info.getValue(),
        },
    ];

    const table = useReactTable({
        data: orphans,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });


    if (lbLoading) return <Loading />
    if (lbError) return <NotFound />
    return (
        <div className="flex flex-col pt-8 max-w-6xl mx-auto text-foreground">

            <div className="w-full text-foreground bg-background " >
                <table className="w-full table-fixed border-collapse text-sm">
                    <thead className="bg-card" >
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
        </div>
    );
}
