// import { Link } from "react-router-dom";
// import type { CharacterDetailsEntry } from "../../types/leaderboard";
// import { Fragment, useMemo, useState } from "react";
// import type { ColumnDef } from "@tanstack/react-table";
// import { CheckCircleIcon, XCircleIcon } from "@phosphor-icons/react";
// import { formatDate, formatSeconds } from "../../utils/time";
// import type { DateTime } from "luxon";
// import RoleChip from "../atom/rolechip";

// // const cardBase =
// //     "rounded-lg bg-background shadow-sm ring-1 ring-gray-700/50 overflow-hidden";
// export interface CharacterWarHistoryProps {
//     history: CharacterDetailsEntry[];
// }
// // function CharacterWarHistory({ history }: CharacterWarHistoryProps) {
// //     const sort = [{ id: "date", desc: true }];


// //     const columns = useMemo<ColumnDef<CharacterDetailsEntry>[]>(
// //         () => [
// //             {
// //                 accessorKey: "date",
// //                 header: "Date",
// //                 cell: info => (
// //                     <div className="text-left">
// //                         {formatDate(info.getValue<DateTime>())}
// //                     </div>
// //                 )
// //             },
// //             {
// //                 accessorKey: "warid",
// //                 header: "War",
// //                 cell: info => {
// //                     const row = info.row.original;
// //                     return (
// //                         < Link to={`/wars/${info.getValue<number>()}`}>
// //                             <span className="hover:underline">{row.attacker.name} vs {row.defender.name}</span>
// //                         </Link >
// //                     );
// //                 },
// //             },
// //             {
// //                 accessorKey: 'roleAssignment',
// //                 header: () => (
// //                     <LabelIcon text={'Role'} icon={<GameControllerIcon weight="fill" />} />
// //                 ),
// //                 sortingFn: (rowA, rowB) => {
// //                     const a = rowA.original.roleAssignment?.role ?? "";
// //                     const b = rowB.original.roleAssignment?.role ?? "";
// //                     return sortRolesStrings(a, b);
// //                 },
// //                 cell: info => {
// //                     const value = info.getValue<RoleAssignment>();
// //                     return (
// //                         <RoleChip role={value.role} />
// //                     );
// //                 },
// //             },
// //             {
// //                 accessorKey: "isWinner",
// //                 header: "Win/Loss",
// //                 cell: info => (
// //                     <div className="flex justify-center items-center">
// //                         {info.getValue<boolean>() ? <CheckCircleIcon weight="bold" className="text-green-500" /> : <XCircleIcon weight="bold" className="text-red-500" />}
// //                     </div>
// //                 ),
// //             },
// //             {
// //                 accessorKey: "duration",
// //                 header: "Duration",
// //                 cell: info => (
// //                     <div className="text-right">{formatSeconds(info.getValue<number>())}</div>
// //                 ),
// //             },
// //             {
// //                 accessorKey: "score",
// //                 header: "Score",
// //                 cell: info => (
// //                     <div className="text-right">
// //                         <NumberCell value={info.getValue<number>()} />
// //                     </div>
// //                 ),
// //             },
// //             {
// //                 accessorKey: "kills",
// //                 header: "Kills",
// //                 cell: info => (
// //                     <div className="text-right">
// //                         <NumberCell value={info.getValue<number>()} />
// //                     </div>
// //                 ),
// //             },
// //             {
// //                 accessorKey: "deaths",
// //                 header: "Deaths",
// //                 cell: info => (
// //                     <div className="text-right">
// //                         <NumberCell value={info.getValue<number>()} />
// //                     </div>
// //                 ),
// //             },
// //             {
// //                 accessorKey: "assists",
// //                 header: "Assists",
// //                 cell: info => (
// //                     <div className="text-right">
// //                         <NumberCell value={info.getValue<number>()} />
// //                     </div>
// //                 ),
// //             },
// //             {
// //                 accessorKey: "healing",
// //                 header: "Healing",
// //                 cell: info => (
// //                     <div className="text-right">
// //                         <NumberCell value={info.getValue<number>()} />
// //                     </div>
// //                 ),
// //             },
// //             {
// //                 accessorKey: "damage",
// //                 header: "Damage",
// //                 cell: info => (
// //                     <div className="text-right">
// //                         <NumberCell value={info.getValue<number>()} />
// //                     </div>
// //                 ),
// //             },
// //         ],
// //         []
// //     );


// //     return (
// //         <div className={`${cardBase}`}>
// //             {history.length > 0 ? (
// //                 <div className="pb-2">
// //                     <StatsTable columns={columns} data={history} sort={sort} />
// //                 </div>
// //             ) : (
// //                 <div className="p-3 text-muted">
// //                     No data
// //                 </div>
// //             )}
// //         </div>
// //     );
// // }

// export default CharacterWarHistory


// import {
//     type ExpandedState,
//     flexRender,
//     getCoreRowModel,
//     getExpandedRowModel,
//     useReactTable,
// } from "@tanstack/react-table";
// import type { RoleAssignment } from "../../types/role";

// function CharacterWarHistory({ history }: CharacterWarHistoryProps) {
//     const [expanded, setExpanded] = useState<ExpandedState>({});

//     const columns = useMemo<ColumnDef<CharacterDetailsEntry>[]>(
//         () => [
//             {
//                 accessorKey: "date",
//                 header: "Date",
//                 cell: info =>
//                     <div className="flex flex-row">
//                         {formatDate(info.getValue<DateTime>())}
//                     </div>
//             },

//             {
//                 accessorKey: "warid",
//                 header: "War",
//                 cell: info => {
//                     const row = info.row.original;

//                     return (
//                         <Link
//                             to={`/wars/${info.getValue<number>()}`}
//                             className="hover:underline"
//                         >
//                             {/* Mobile */}
//                             <span className="sm:hidden">
//                                 {row.attacker.shorthand} vs {row.defender.shorthand}
//                             </span>

//                             {/* Tablet/Desktop */}
//                             <span className="hidden sm:inline">
//                                 {row.attacker.name} vs {row.defender.name}
//                             </span>
//                         </Link>
//                     );
//                 }
//             },
//             {
//                 accessorKey: 'roleAssignment',
//                 header: "Role",
//                 cell: info => (
//                     <div className="flex flex-row justify-center items-center">
//                         <RoleChip role={info.getValue<RoleAssignment>().role} />
//                     </div>
//                 )
//             },
//             {
//                 accessorKey: "isWinner",
//                 header: "W/L",
//                 cell: info => (
//                     <div className="flex justify-center items-center">
//                         {info.getValue<boolean>()
//                             ? <CheckCircleIcon className="text-green-500" />
//                             : <XCircleIcon className="text-red-500" />
//                         }
//                     </div>)
//             },
//             {
//                 accessorKey: "kills",
//                 header: "K",
//                 cell: info => (
//                     <div className="w-4 border-2 flex justify-end">
//                         {info.getValue<number>()}
//                     </div>
//                 )
//             },
//             {
//                 accessorKey: "deaths",
//                 header: "D",
//                 cell: info => (
//                     <div className="w-10 flex justify-end">
//                         {info.getValue<number>()}
//                     </div>
//                 )
//             },
//             {
//                 accessorKey: "assists",
//                 header: "A",
//                 cell: info => (
//                     <div className="w-10 flex justify-end">
//                         {info.getValue<number>()}
//                     </div>
//                 )
//             }
//             // {
//             //     id: "kda",
//             //     header: "K/D/A",
//             //     cell: info => {
//             //         const row = info.row.original;

//             //         return (
//             //             <div className="flex justify-center items-center">
//             //                 <span>
//             //                     {row.kills}/{row.deaths}/{row.assists}
//             //                 </span>
//             //             </div>
//             //         );
//             //     }
//             // }
//         ],
//         []
//     );

//     const table = useReactTable({
//         data: history,
//         columns,
//         state: {
//             expanded
//         },
//         onExpandedChange: setExpanded,

//         getCoreRowModel: getCoreRowModel(),
//         getExpandedRowModel: getExpandedRowModel(),

//         getRowCanExpand: () => true
//     });

//     return (
//         <table className="w-full">
//             <thead>
//                 {table.getHeaderGroups().map(group => (
//                     <tr key={group.id}>
//                         {group.headers.map(header => (
//                             <th key={header.id}>
//                                 {flexRender(
//                                     header.column.columnDef.header,
//                                     header.getContext()
//                                 )}
//                             </th>
//                         ))}
//                     </tr>
//                 ))}
//             </thead>

//             <tbody className="divide-y divide-border">
//                 {table.getRowModel().rows.map(row => (
//                     <Fragment key={row.id}>
//                         <tr
//                             className="cursor-pointer hover:bg-muted py-4"
//                             onClick={row.getToggleExpandedHandler()}
//                         >
//                             {row.getVisibleCells().map(cell => (
//                                 <td
//                                     key={cell.id}
//                                     className={`py-2 tabular-nums ${cell.column.columnDef.meta?.className ?? ""
//                                         }`}
//                                 >
//                                     {flexRender(
//                                         cell.column.columnDef.cell,
//                                         cell.getContext()
//                                     )}
//                                 </td>
//                             ))}
//                         </tr>

//                         {row.getIsExpanded() && (
//                             <tr className="">
//                                 <td
//                                     colSpan={columns.length}
//                                     className="bg-muted/30 p-3"
//                                 >
//                                     <div className="grid grid-cols-2 gap-2 text-sm">

//                                         <div>
//                                             <strong>Role:</strong>{" "}
//                                             <RoleChip
//                                                 role={row.original.roleAssignment.role}
//                                             />
//                                         </div>

//                                         <div>
//                                             <strong>Duration:</strong>{" "}
//                                             {formatSeconds(row.original.duration)}
//                                         </div>

//                                         <div>
//                                             <strong>Score:</strong>{" "}
//                                             {row.original.score}
//                                         </div>

//                                         <div>
//                                             <strong>Healing:</strong>{" "}
//                                             {row.original.healing.toLocaleString()}
//                                         </div>

//                                         <div>
//                                             <strong>Damage:</strong>{" "}
//                                             {row.original.damage.toLocaleString()}
//                                         </div>

//                                     </div>
//                                 </td>
//                             </tr>
//                         )}
//                     </Fragment>
//                 ))}
//             </tbody>
//         </table>
//     );
// }
import { Fragment, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
    type ColumnDef,
    type ExpandedState,
    flexRender,
    getCoreRowModel,
    getExpandedRowModel,
    getSortedRowModel,
    type SortingState,
    useReactTable,
} from "@tanstack/react-table";

import {
    CheckCircleIcon,
    XCircleIcon,
} from "@phosphor-icons/react";

import type { DateTime } from "luxon";

import type { CharacterDetailsEntry } from "../../types/leaderboard";
import type { RoleAssignment } from "../../types/role";

import { formatDate, formatSeconds } from "../../utils/time";
import RoleChip from "../atom/rolechip";
import type { GroupKey } from "../../types/roster";

declare module "@tanstack/react-table" {
    interface ColumnMeta<TData, TValue> {
        className?: string;
    }
}

export interface CharacterWarHistoryProps {
    history: CharacterDetailsEntry[];
}

export default function CharacterWarHistory({
    history
}: CharacterWarHistoryProps) {

    const [expanded, setExpanded] =
        useState<ExpandedState>({});

    const [sorting, setSorting] =
        useState<SortingState>([
            {
                id: "date",
                desc: true
            }
        ]);

    const columns =
        useMemo<ColumnDef<CharacterDetailsEntry>[]>(
            () => [
                {
                    accessorKey: "date",
                    header: "Date",
                    cell: info => (
                        <div>
                            <span className="sm:hidden">
                                {formatDate(info.getValue<DateTime>(), false)}
                            </span>
                            <span className="hidden sm:inline">
                                {formatDate(info.getValue<DateTime>())}
                            </span>
                        </div>
                    )

                },

                {
                    accessorKey: "warid",
                    header: "War",
                    cell: info => {
                        const row =
                            info.row.original;

                        return (
                            <Link
                                to={`/wars/${info.getValue<number>()}`}
                                className="hover:underline"
                            >
                                {/* Mobile */}
                                <span className="sm:hidden">
                                    {row.attacker.shorthand}
                                    {" vs "}
                                    {row.defender.shorthand}
                                </span>

                                {/* Desktop */}
                                <span className="hidden sm:inline">
                                    {row.attacker.name}
                                    {" vs "}
                                    {row.defender.name}
                                </span>
                            </Link>
                        );
                    }
                },
                {
                    accessorKey: 'character',
                    header: 'Character',

                    meta: {
                        className: "hidden sm:table-cell"
                    },

                    cell: info => (
                        <span className="hidden sm:inline">
                            {info.getValue<string>()}
                        </span>
                    )
                },
                {
                    accessorKey: 'group',
                    header: () => (
                        <div>Group</div>
                    ),

                    cell: info => (
                        <div className="w-full text-center">{info.getValue<GroupKey>()}</div>
                    )
                },
                {
                    accessorKey: "roleAssignment",
                    header: () => (
                        <div className="w-full flex text-center">
                            Role
                        </div>
                    ),

                    sortingFn: (rowA, rowB) => {
                        const a =
                            rowA.original.roleAssignment.role;

                        const b =
                            rowB.original.roleAssignment.role;

                        return a.localeCompare(b);
                    },

                    meta: {
                        className: "text-center"
                    },

                    cell: info => (
                        <div className="flex justify-center">
                            <RoleChip
                                role={
                                    info.getValue<RoleAssignment>()
                                        .role
                                }
                            />
                        </div>
                    )
                },

                {
                    accessorKey: "isWinner",
                    header: "W/L",
                    meta: {
                        className: "text-center w-12"
                    },
                    cell: info => (
                        <div className="flex justify-center">
                            {info.getValue<boolean>()
                                ? (
                                    <CheckCircleIcon
                                        className="text-green-500"
                                    />
                                )
                                : (
                                    <XCircleIcon
                                        className="text-red-500"
                                    />
                                )}
                        </div>
                    )
                },

                {
                    accessorKey: "kills",
                    header: "K",
                    cell: info =>
                        info.getValue<number>()
                },

                {
                    accessorKey: "deaths",
                    header: "D",
                    cell: info =>
                        info.getValue<number>()
                },

                {
                    accessorKey: "assists",
                    header: "A",
                    cell: info =>
                        info.getValue<number>()
                },
            ],
            []
        );

    const table = useReactTable({
        data: history,
        columns,

        state: {
            expanded,
            sorting
        },

        onExpandedChange:
            setExpanded,

        onSortingChange:
            setSorting,

        getCoreRowModel:
            getCoreRowModel(),

        getExpandedRowModel:
            getExpandedRowModel(),

        getSortedRowModel:
            getSortedRowModel(),

        getRowCanExpand:
            () => true,
    });

    return (
        <table className="w-full">
            <thead>
                {table
                    .getHeaderGroups()
                    .map(group => (
                        <tr key={group.id}>
                            {group.headers.map(header => {

                                const sorted =
                                    header.column.getIsSorted();

                                return (
                                    <th
                                        key={header.id}
                                        onClick={header.column.getToggleSortingHandler()}
                                        className={`
                                pb-3
                                text-left
                                text-sm
                                font-medium
                                select-none
                                cursor-pointer
                                hover:text-foreground
                                transition-colors
                                ${header.column.columnDef.meta?.className ?? ""}
                            `}
                                    >
                                        <div className="flex items-center gap-1">

                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}

                                            {sorted === "asc" && "▲"}
                                            {sorted === "desc" && "▼"}

                                        </div>
                                    </th>
                                );
                            })}
                        </tr>
                    ))}
            </thead>

            <tbody className="divide-y divide-border">

                {table
                    .getRowModel()
                    .rows
                    .map(row => (

                        <Fragment key={row.id}>

                            <tr
                                className="cursor-pointer hover:bg-muted/20 transition-colors"
                                onClick={
                                    row.getToggleExpandedHandler()
                                }
                            >
                                {row
                                    .getVisibleCells()
                                    .map(cell => (

                                        <td
                                            key={cell.id}
                                            className={`py-3 tabular-nums ${cell.column
                                                .columnDef
                                                .meta
                                                ?.className ?? ""
                                                }`}
                                        >
                                            {flexRender(
                                                cell.column
                                                    .columnDef
                                                    .cell,
                                                cell.getContext()
                                            )}
                                        </td>
                                    ))}
                            </tr>

                            {row.getIsExpanded() && (
                                <tr>

                                    <td
                                        colSpan={
                                            columns.length
                                        }
                                        className="bg-muted/30 px-4 py-4"
                                    >

                                        <div className="grid grid-cols-2 gap-y-3 text-sm">

                                            <div>
                                                <strong>
                                                    Role:
                                                </strong>{" "}
                                                <RoleChip
                                                    role={
                                                        row.original
                                                            .roleAssignment
                                                            .role
                                                    }
                                                />
                                            </div>

                                            <div>
                                                <strong>
                                                    Duration:
                                                </strong>{" "}
                                                {formatSeconds(
                                                    row.original
                                                        .duration
                                                )}
                                            </div>

                                            <div>
                                                <strong>
                                                    Score:
                                                </strong>{" "}
                                                {row.original.score}
                                            </div>

                                            <div>
                                                <strong>
                                                    Healing:
                                                </strong>{" "}
                                                {row.original.healing.toLocaleString()}
                                            </div>

                                            <div>
                                                <strong>
                                                    Damage:
                                                </strong>{" "}
                                                {row.original.damage.toLocaleString()}
                                            </div>

                                        </div>

                                    </td>

                                </tr>
                            )}

                        </Fragment>
                    ))}

            </tbody>

        </table>
    );
}
