import React, { useMemo } from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import type { GroupPerformance, LeaderboardEntry } from '../../types/leaderboard';
import NumberCell from '../atom/numbercell';
import LabelIcon from '../atom/labelicon';
import StatsTable, { type Calculation } from '../atom/statstble';
import { Link } from 'react-router-dom';
import { FireIcon, FirstAidIcon, GameControllerIcon, HandshakeIcon, PercentIcon, PlusCircleIcon, SkullIcon, SwordIcon, UsersIcon } from '@phosphor-icons/react';
import type { GroupKey } from '../../types/roster';
import { formatPercent } from '../../utils/format';
import { sortRolesStrings } from '../../utils/roster';
import type { Role } from '../../types/role';


interface GroupDisplayProps {
    groupId: GroupKey;
    group: GroupPerformance;
    hideRoles: boolean;
    splitRoles?: string[];
}

const GroupDisplay: React.FC<GroupDisplayProps> = ({ groupId, group, hideRoles, splitRoles }) => {
    const sort = [hideRoles ? { id: 'score', desc: true } : { id: "roleAssignment", desc: false }];

    const columns = React.useMemo<ColumnDef<LeaderboardEntry>[]>(() => {
        const baseCols: ColumnDef<LeaderboardEntry>[] = [
            {
                accessorKey: 'character',
                header: () => (<LabelIcon text={"Player"} icon={<UsersIcon weight="fill" />} />),
                cell: info => (
                    <div className="text-left hover:underline">
                        <Link to={`/players/${info.getValue<string>()}`}>
                            {info.getValue<string>()}
                        </Link>
                    </div>
                )
            },
            {
                accessorKey: 'score',
                header: () => (<LabelIcon text={'Score'} icon={<PlusCircleIcon weight="fill" />} />),
                cell: info => (
                    <div className="text-right">
                        <NumberCell value={info.getValue<number>()} />
                    </div>
                ),
            },
            {
                accessorKey: 'kills',
                header: () => <LabelIcon text='Kills' icon={<SwordIcon weight='fill' />} />,
                cell: info => (
                    <div className="text-right">
                        <NumberCell value={info.getValue<number>()} />
                    </div>
                ),
            },
            {
                accessorKey: 'deaths',
                header: () => <LabelIcon text='Deaths' icon={<SkullIcon weight='fill' />} />,
                cell: info => (
                    <div className="text-right">
                        <NumberCell value={info.getValue<number>()} />
                    </div>
                ),
            },
            {
                accessorKey: 'assists',
                header: () => <LabelIcon text='Assists' icon={<HandshakeIcon weight='fill' />} />,
                cell: info => (
                    <div className="text-right">
                        <NumberCell value={info.getValue<number>()} />
                    </div>
                ),
            },
            {
                accessorKey: 'healing',
                header: () => <LabelIcon text='Healing' icon={<FirstAidIcon weight='fill' />} />,
                cell: info => (
                    <div className="text-right">
                        <NumberCell value={info.getValue<number>()} />
                    </div>
                ),
            },
            {
                accessorKey: 'damage',
                header: () => <LabelIcon text='Damage' icon={<FireIcon weight='fill' />} />,
                cell: info => (
                    <div className="text-right">
                        <NumberCell value={info.getValue<number>()} />
                    </div>
                ),
            },
            {
                accessorKey: 'kpar',
                header: () => <LabelIcon text='KPAR' icon={<PercentIcon weight='fill' />} />,
                cell: info => (
                    <div className="text-right">
                        {formatPercent(info.getValue<number>())}
                    </div>
                ),
            },
        ];

        // Insert role column only if NOT hidden
        if (!hideRoles) {
            baseCols.splice(1, 0, {
                accessorKey: 'roleAssignment',
                header: () => (
                    <LabelIcon text={'Role'} icon={<GameControllerIcon weight="fill" />} />
                ),
                sortingFn: (rowA, rowB) => {
                    const a = rowA.original.role?.name ?? "";
                    const b = rowB.original.role?.name ?? "";
                    return sortRolesStrings(a, b);
                },
                cell: info => {
                    const value = info.getValue<{ role: Role; inferred: boolean }>();
                    if (!value?.role) return <span className="text-gray-400 italic"></span>;
                    return (
                        <span className={value.inferred ? "italic text-gray-600" : ""}>
                            {value.role}
                        </span>
                    );
                },
            });
        }

        return baseCols;
    }, [hideRoles]);

    const calcColumns: Calculation[] = [
        { fn: "sum", column: "score" },
        { fn: "sum", column: "kills" },
        { fn: "sum", column: "deaths" },
        { fn: "sum", column: "assists" },
        { fn: "sum", column: "healing" },
        { fn: "sum", column: "damage" },
        { fn: 'average', column: 'kpar' },
    ]

    const override = splitRoles ? {
        "healing": group.stats
            .filter(s => splitRoles.some(v => {
                if (s.role) {
                    return !s.role.name.toLowerCase().includes(v)
                }
                return true;
            }))
            .reduce((sum, s) => sum + s.healing, 0)
    } : undefined;

    const combinedData = useMemo(() => {
        return group.stats.map(entry => {
            return { ...entry };
        })
    }, [group]);

    const label: string = groupId !== 'strong' && groupId !== 'weak' ? `Group ${groupId}` : `${groupId.substring(0, 1).toUpperCase()}${groupId.substring(1)} side QDPS`;

    return (
        <div className="text-white">
            <div className="font-bold p-2 bg-gray-800 rounded-t-lg text-xs">{label}</div>
            <StatsTable columns={columns} data={combinedData} sort={sort} calc={calcColumns} bottomRowOverride={override} />
        </div >
    );
};

export default GroupDisplay
