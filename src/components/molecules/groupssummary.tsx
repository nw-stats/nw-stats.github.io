import React from 'react';
import {
    type ColumnDef,


} from '@tanstack/react-table';
import type { StatTotals } from '../../types/leaderboard';
import NumberCell from '../atom/numbercell';
import LabelIcon from '../atom/labelicon';
import StatsTable from '../atom/statstble';
import { FireIcon, FirstAidIcon, HandshakeIcon, PercentIcon, PlusCircleIcon, SkullIcon, SwordIcon, UsersIcon } from '@phosphor-icons/react';
import type { GroupKey } from '../../types/roster';
import { formatPercent } from '../../utils/format';

interface GroupsSummaryProps {
    groups?: Map<GroupKey, StatTotals>;
}
const GroupsSummary: React.FC<GroupsSummaryProps> = ({
    groups
}) => {


    const columns = React.useMemo<ColumnDef<StatTotals>[]>(
        () => [
            {
                accessorKey: 'name',
                header: () => (<LabelIcon text={"Group"} icon={<UsersIcon weight="fill" />} />),
                cell: info => (
                    <div className="text-left">
                        {info.getValue<string>()}
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

    const data: Array<StatTotals> = React.useMemo(() => {
        if (!groups) return [];

        return Array.from(groups.keys())
            .sort((a, b) => {
                const keyA = a;
                const keyB = b;

                // If both are numbers, sort numerically
                if (typeof keyA === 'number' && typeof keyB === 'number') {
                    return keyA - keyB;
                }

                // If one is a number and the other is a string, number comes first
                if (typeof keyA === 'number') return -1;
                if (typeof keyB === 'number') return 1;

                // If both are strings, sort 'Weak' before 'Strong'
                if (keyA === keyB) return 0;
                if (keyA === 'Weak') return -1;
                return 1; // keyB === 'Weak' or keyA === 'Strong' > keyB === 'Strong'
            })
            .map(key => groups.get(key))
            .filter((item): item is StatTotals => item !== undefined);
    }, [groups]);

    return (
        <div className="bg-gray-800 text-white rounded-lg shadow-md overflow-x-auto">
            <h2 className="text-lg font-bold p-2">Group Summary</h2>

            {groups ? (
                <div className="text-lg"><StatsTable columns={columns} data={data} /></div>
            ) : (<div className='text-gray-500 p-2'>No data</div>)}
        </div>
    );
};

export default GroupsSummary;
