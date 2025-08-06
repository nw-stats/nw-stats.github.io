import { Link } from "react-router-dom";
import type { CharacterDetailsEntry } from "../../types/leaderboard";
import { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import NumberCell from "../atom/numbercell";
import StatsTable from "../atom/statstble";
import { CheckCircleIcon, XCircleIcon } from "@phosphor-icons/react";
import { formatSeconds } from "../../utils/time";


export interface CharacterWarHistoryProps {
    history: CharacterDetailsEntry[];
}
function CharacterWarHistory({ history }: CharacterWarHistoryProps) {
    const sort = [{ id: "date", desc: true }];


    const columns = useMemo<ColumnDef<CharacterDetailsEntry>[]>(
        () => [
            {
                accessorKey: "date",
                header: "Date",
                cell: info => (
                    <div className="text-left">
                        {info.getValue<Date>().toLocaleDateString()}
                    </div>
                )
            },
            {
                accessorKey: "warid",
                header: "War",
                cell: info => {
                    const row = info.row.original;
                    return (
                        < Link to={`/wars/${info.getValue<number>()}`}>
                            <span className="hover:underline">{row.attacker} vs {row.defender}</span>
                        </Link >
                    );
                },
            },
            {
                accessorKey: "isWinner",
                header: "Win/Loss",
                cell: info => (
                    <div className="flex justify-center items-center">
                        {info.getValue<boolean>() ? <CheckCircleIcon weight="bold" className="text-green-500" /> : <XCircleIcon weight="bold" className="text-red-500" />}
                    </div>
                ),
            },
            {
                accessorKey: "duration",
                header: "Duration",
                cell: info => (
                    <div className="text-right">{formatSeconds(info.getValue<number>())}</div>
                ),
            },
            {
                accessorKey: "score",
                header: "Score",
                cell: info => (
                    <div className="text-right">
                        <NumberCell value={info.getValue<number>()} />
                    </div>
                ),
            },
            {
                accessorKey: "kills",
                header: "Kills",
                cell: info => (
                    <div className="text-right">
                        <NumberCell value={info.getValue<number>()} />
                    </div>
                ),
            },
            {
                accessorKey: "deaths",
                header: "Deaths",
                cell: info => (
                    <div className="text-right">
                        <NumberCell value={info.getValue<number>()} />
                    </div>
                ),
            },
            {
                accessorKey: "assists",
                header: "Assists",
                cell: info => (
                    <div className="text-right">
                        <NumberCell value={info.getValue<number>()} />
                    </div>
                ),
            },
            {
                accessorKey: "healing",
                header: "Healing",
                cell: info => (
                    <div className="text-right">
                        <NumberCell value={info.getValue<number>()} />
                    </div>
                ),
            },
            {
                accessorKey: "damage",
                header: "Damage",
                cell: info => (
                    <div className="text-right">
                        <NumberCell value={info.getValue<number>()} />
                    </div>
                ),
            },
        ],
        []
    );


    return (
        <div className="bg-gray-700">
            <h1 className="text-white font-semibold p-2">War History</h1>
            {history.length > 0 ? (< StatsTable columns={columns} data={history} sort={sort} />) : (<div className='text-gray-500 p-2'>No data</div>)}
        </div>
    );
}

export default CharacterWarHistory
