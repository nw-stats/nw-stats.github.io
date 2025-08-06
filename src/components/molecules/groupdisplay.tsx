import React, { useMemo } from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import type { GroupPerformance, LeaderboardEntry } from '../../types/leaderboard';
import NumberCell from '../atom/numbercell';
import LabelIcon from '../atom/labelicon';
import StatsTable, { type Calculation } from '../atom/statstble';
import { Link } from 'react-router-dom';
import { kRoleOrder } from '../../constants/roleorder';
import { FireIcon, FirstAidIcon, GameControllerIcon, HandshakeIcon, PercentIcon, PlusCircleIcon, SkullIcon, SwordIcon, UsersIcon } from '@phosphor-icons/react';
import type { GroupKey } from '../../types/roster';
import { formatPercent } from '../../utils/format';


interface GroupDisplayProps {
    groupId: GroupKey;
    group: GroupPerformance;
}

const GroupDisplay: React.FC<GroupDisplayProps> = ({ groupId, group }) => {
    const sort = [{ id: "role", desc: false }];

    const columns = React.useMemo<ColumnDef<LeaderboardEntry>[]>(
        () => [
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
                accessorKey: 'role',
                header: () => <LabelIcon text={'Role'} icon={<GameControllerIcon weight="fill" />} />,
                sortingFn: (rowA, rowB) => {
                    const a = rowA.getValue<string>('role');
                    const b = rowB.getValue<string>('role');
                    const ai = kRoleOrder.indexOf(a);
                    const bi = kRoleOrder.indexOf(b);
                    return ai - bi;
                },
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
                header: () => <LabelIcon text='Healing' icon={<FirstAidIcon weight='fill' />
                } />,
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
        ],
        []
    );

    const calcColumns: Calculation[] = [
        { fn: "sum", column: "score" },
        { fn: "sum", column: "kills" },
        { fn: "sum", column: "deaths" },
        { fn: "sum", column: "assists" },
        { fn: "sum", column: "healing" },
        { fn: "sum", column: "damage" },
        { fn: 'average', column: 'kpar' },
    ]

    const combinedData = useMemo(() => {
        return group.stats.map(entry => {
            return { ...entry };
        })
    }, [group]);


    return (
        <div className="text-white">
            <div className="font-bold p-2 bg-gray-800 rounded-t-lg text-xs">Group {groupId}</div>
            <StatsTable columns={columns} data={combinedData} sort={sort} calc={calcColumns} />
        </div >
    );
};

export default GroupDisplay
