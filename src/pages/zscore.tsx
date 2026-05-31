import { useMemo, type JSX } from "react";
import { useMeanStdev } from "../hooks/useMeanStdev";
import Loading from "../components/atom/loading";
import NotFound from "./notfound";
import StatsTable from "../components/atom/statstble";
import { transformForReactTables, type RolePerformanceProfileRow } from "../domain/stats/transformer";
import { type ColumnDef } from "@tanstack/react-table";
import NumberCell from "../components/atom/numbercell";

import { kSheetIds } from "../constants/sheets";
import { useSeason } from "../hooks/base/useSeason";

export default function ZScore(): JSX.Element {
    const { season } = useSeason();
    const { loading, error, zscore } = useMeanStdev(kSheetIds[season]);

    const transformedZScore = useMemo(() => transformForReactTables(zscore), [zscore]);
    const columns = useMemo<ColumnDef<RolePerformanceProfileRow>[]>(() => ([
        {
            accessorKey: 'role',
        },
        {
            accessorKey: 'killsMean',
            cell: info => (
                <NumberCell value={info.getValue<number>()} />
            )
        },
        {
            accessorKey: 'killsStdev',
            cell: info => (
                <NumberCell value={info.getValue<number>()} />
            )
        },
        {
            accessorKey: 'deathsMean',
            cell: info => (
                <NumberCell value={info.getValue<number>()} />
            )
        },
        {
            accessorKey: 'deathsStdev',
            cell: info => (
                <NumberCell value={info.getValue<number>()} />
            )
        },
        {
            accessorKey: 'assistsMean',
            cell: info => (
                <NumberCell value={info.getValue<number>()} />
            )
        },
        {
            accessorKey: 'assistsStdev',
            cell: info => (
                <NumberCell value={info.getValue<number>()} />
            )
        },
        {
            accessorKey: 'healingMean',
            cell: info => (
                <NumberCell value={info.getValue<number>()} figures={0} />
            )
        },
        {
            accessorKey: 'healingStdev',
            cell: info => (
                <NumberCell value={info.getValue<number>()} figures={0} />
            )
        },
        {
            accessorKey: 'damageMean',
            cell: info => (
                <NumberCell value={info.getValue<number>()} figures={0} />
            )
        },
        {
            accessorKey: 'damageStdev',
            cell: info => (
                <NumberCell value={info.getValue<number>()} figures={0} />
            )
        },
    ]), []);

    if (loading) return <Loading />
    if (error) return <NotFound />
    return (
        <div>
            {transformedZScore.length && <StatsTable columns={columns} data={transformedZScore} />}
        </div>
    );
}
