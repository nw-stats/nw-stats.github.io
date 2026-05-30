import { useMemo, type JSX } from "react";
import NotFound from "./notfound";
import Loading from "../components/atom/loading";
import { type ColumnDef, } from "@tanstack/react-table";
import { useZScore } from "../hooks/useZScore";
import type { StatZScore } from "../domain/stats/types";
import StatsTable from "../components/atom/statstble";
import { transformPlayerPerformanceForReactTables } from "../domain/stats/transformer";
import { Link, useSearchParams } from "react-router-dom";
import Dropdown from "../components/atom/dropdown";
import Grade from "../components/atom/grade";
import RoleChip from "../components/atom/rolechip";
import type { Role } from "../types/role";

export default function PlayerRankings(): JSX.Element {
    const { loading, error, zscore } = useZScore();

    const [searchParams, setSearchParams] = useSearchParams();

    const selectedRole = searchParams.get("role") ?? "All";
    const setSelectedRole = (role: string) => {
        setSearchParams(prev => {
            const next = new URLSearchParams(prev);
            next.set("role", role);
            return next;
        }, { replace: true });
    };

    const filterTerm = searchParams.get("who") ?? "";
    const setFilterTerm = (who: string) => {
        setSearchParams(prev => {
            const next = new URLSearchParams(prev);
            next.set("who", who);
            return next
        }, { replace: true });
    };

    const forReactTable = useMemo(() => {
        return transformPlayerPerformanceForReactTables(zscore);
    }, [zscore]);

    const filteredData = useMemo(() => {
        return forReactTable
            .filter(v => v.role === selectedRole || selectedRole == 'All')
            .filter(v => v.name.toLowerCase().includes(filterTerm.toLowerCase()));
    }, [forReactTable, selectedRole, filterTerm])

    const roleOptions = useMemo(() => {
        const s = new Set<string>();
        s.add('All')
        for (const row of forReactTable) {
            if (row.role)
                s.add(row.role);
        }
        const sorted = Array.from(s).sort();
        return sorted;
    }, [forReactTable]);

    const colmns = useMemo<ColumnDef<StatZScore>[]>(() => ([
        {
            accessorKey: 'name',
            cell: info => (
                <div className="text-left hover:underline">
                    <Link to={`/character/${info.getValue<string>()}`}>
                        {info.getValue<string>()}
                    </Link>
                </div>
            )
        },
        {
            accessorKey: 'role',
            cell: info => (
                <RoleChip role={info.getValue<Role>()} />
            )
        },
        {
            accessorKey: 'kills',
            cell: info => (
                <div className="flex items-center justify-center">
                    <Grade inverse={false} value={info.getValue<number>()} />
                </div>
            ),
        },
        {
            accessorKey: 'deaths',
            cell: info => (
                <div className="flex items-center justify-center">
                    <Grade inverse={true} value={info.getValue<number>()} />
                </div>
            ),
        },
        {
            accessorKey: 'assists',
            cell: info => (
                <div className="flex items-center justify-center">
                    <Grade inverse={false} value={info.getValue<number>()} />
                </div>
            ),
        },
        {
            accessorKey: 'healing',
            cell: info => (
                <div className="flex items-center justify-center">
                    <Grade inverse={false} value={info.getValue<number>()} />
                </div>
            ),
        },
        {
            accessorKey: 'damage',
            cell: info => (
                <div className="flex items-center justify-center">
                    <Grade inverse={false} value={info.getValue<number>()} />
                </div>
            ),
        },
    ]), []);

    if (loading) return <Loading />
    if (error) return <NotFound />
    return (
        <div className="pt-4 flex flex-col items-center gap-4">
            <div className="flex flex-row">
                <div>Role:</div>
                <Dropdown
                    options={roleOptions}
                    value={selectedRole}
                    onChange={setSelectedRole}
                />
            </div>
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
            <div className="w-full max-w-6xl">
                <StatsTable columns={colmns} data={filteredData} />
            </div>
        </div>
    );
}
