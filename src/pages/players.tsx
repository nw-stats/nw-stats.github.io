import Loading from "../components/atom/loading";
import { useMemo, type JSX } from "react";
import NotFound from "./notfound";
import { type ColumnDef, flexRender, getCoreRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import LabelIcon from "../components/atom/labelicon";
import { MaskHappyIcon, UserIcon } from "@phosphor-icons/react";
import { Link, useSearchParams } from "react-router-dom";
import { factionBgSecondary, factionBgTertiary } from "../utils/factions";
import { usePlayerList } from "../hooks/usePlayerList";
import { type Player } from "../types/player";
import type { Character } from "../types/character";
import Chip from "../components/atom/chip";
import { useSeason } from "../hooks/base/useSeason";
import { kSheetIds } from "../constants/sheets";

// const Players: React.FC = () => {
//     const { loading, error, players } = useCharacters();
//     const [search, setSearch] = useState("");

//     if (loading) return <Loading></Loading>
//     if (error || !players) return <Construction></Construction>


//     const filteredPlayers = players.filter((p) =>
//         p.name.toLowerCase().includes(search.toLowerCase())
//     );
//     return (
//         <div className="flex flex-col max-w-3xl  pt-4 pb-4  mx-auto gap-6" >
//             <input
//                 type="text"
//                 placeholder="Search players..."
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 className="p-2 rounded-lg bg-surface-1 text-foreground placeholder-gray-400 w-full"
//             />
//             <div className="flex flex-col gap-2">
//                 {filteredPlayers.map(p => (
//                     <div className="hover:scale-105" key={p.name}>
//                         <PlayerListCard player={p} />
//                     </div>
//                 ))}
//             </div>
//         </div >
//     );
// }

// export default Players;

export default function Players(): JSX.Element {
    const { season } = useSeason();
    const { loading, error, playerList } = usePlayerList(kSheetIds[season]);
    const [searchParams, setSearchParams] = useSearchParams();

    const filterTerm = searchParams.get("who") ?? "";
    const setFilterTerm = (term: string) => {
        setSearchParams(
            prev => {
                const next = new URLSearchParams(prev);
                if (term) {
                    next.set("who", term.toLowerCase());
                } else {
                    next.delete("who");
                }
                return next;
            },
            { replace: true }
        );
    };

    const filtered = useMemo(() => {
        const search = filterTerm.toLowerCase().trim()

        return playerList.filter((player: Player) => {
            const matchesName = player.name
                .toLowerCase()
                .includes(search)

            const matchesAlt = player.alts.some((character: Character) =>
                character.name.toLowerCase().includes(search)
            )

            return matchesName || matchesAlt
        })
    }, [filterTerm, playerList])

    const columns = useMemo<ColumnDef<Player>[]>(() => (
        [
            {
                accessorKey: 'name',
                header: () => (<LabelIcon text='Player' icon={<UserIcon weight="fill" />} />),
                cell: info => (
                    <div className="text-left hover:underline">
                        <Link to={`/players/${info.getValue<string>()}`}>
                            {info.getValue<string>()}
                        </Link>
                    </div>
                )
            },
            {
                accessorKey: 'alts',
                header: () => (<LabelIcon text='Alts' icon={<MaskHappyIcon weight="fill" />} />),
                cell: info => {
                    const characters = info.getValue<Character[]>()

                    return (
                        <div className="flex flex-wrap gap-2">
                            {characters.map((character) => (
                                <Chip key={character.name}>
                                    {character.name}
                                </Chip>
                            ))}
                        </div>
                    )
                }
            }
        ]
    ), []);

    const table = useReactTable({
        data: filtered,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    if (loading) return <Loading />;
    if (error) return <NotFound />;

    return (
        <div className="flex flex-col pt-8 max-w-6xl mx-auto text-foreground gap-4">
            <div className="w-full pt-8 max-w-6xl mx-auto gap-4">
                <div className="bg-background rounded-t-lg">
                    <h1 className="text-foreground font-semibold text-xl p-2">Players</h1>
                    <input
                        type="text"
                        placeholder="Search players..."
                        value={filterTerm}
                        onChange={(e) => setFilterTerm(e.target.value)}
                        className="p-2 rounded-lg bg-surface-1 text-foreground placeholder-muted w-full"
                    />
                </div>
            </div >

            <div className="w-full text-foreground bg-background " >
                <table className="w-full table-fixed border-collapse text-sm">
                    <thead className="bg-surface" >
                        {
                            table.getHeaderGroups().map(headerGroup => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map(header => (
                                        <th
                                            key={header.id}
                                            style={{ width: header.getSize() }}
                                            colSpan={header.colSpan}
                                            onClick={header.column.getToggleSortingHandler()}
                                            className={`cursor-pointer select-none p-2 border-b border-border text-left`}
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
                                            style={{ width: cell.column.getSize() }}
                                            className={`p-3 border-b border-border text-sm`}
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

            {playerList.length === 0 && (
                <div className="text-center py-12 text-muted">
                    No rankings data available yet.
                </div>
            )}
        </div>
    );
}
