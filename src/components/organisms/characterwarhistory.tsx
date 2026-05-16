import { Link } from "react-router-dom";
import type { CharacterDetailsEntry } from "../../types/leaderboard";
import { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import NumberCell from "../atom/numbercell";
import StatsTable from "../atom/statstble";
import { CheckCircleIcon, GameControllerIcon, XCircleIcon } from "@phosphor-icons/react";
import { formatDate, formatSeconds } from "../../utils/time";
import type { DateTime } from "luxon";
import LabelIcon from "../atom/labelicon";
import { sortRolesStrings } from "../../utils/roster";

const cardBase =
    "rounded-lg bg-background shadow-sm ring-1 ring-gray-700/50 overflow-hidden";
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
                        {formatDate(info.getValue<DateTime>())}
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
                            <span className="hover:underline">{row.attacker.name} vs {row.defender.name}</span>
                        </Link >
                    );
                },
            },
            {
                accessorKey: 'roleAssignment',
                header: () => (
                    <LabelIcon text={'Role'} icon={<GameControllerIcon weight="fill" />} />
                ),
                sortingFn: (rowA, rowB) => {
                    const a = rowA.original.roleAssignment?.role ?? "";
                    const b = rowB.original.roleAssignment?.role ?? "";
                    return sortRolesStrings(a, b);
                },
                cell: info => {
                    const value = info.getValue<{ role: string; inferred: boolean }>();
                    if (!value?.role) return <span className="text-gray-400 italic"></span>;
                    return (
                        <span className={value.inferred ? "italic text-gray-600" : ""}>
                            {value.role}
                        </span>
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
        <div className={`${cardBase}`}>
            {history.length > 0 ? (
                <div className="pb-2">
                    <StatsTable columns={columns} data={history} sort={sort} />
                </div>
            ) : (
                <div className="p-3 text-muted">
                    No data
                </div>
            )}
        </div>
    );
}

export default CharacterWarHistory
