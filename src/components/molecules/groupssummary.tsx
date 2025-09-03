import React, { useMemo, type JSX } from 'react';
import { type ColumnDef, } from '@tanstack/react-table';
import type { GroupPerformance, StatTotals } from '../../types/leaderboard';
import NumberCell from '../atom/numbercell';
import LabelIcon from '../atom/labelicon';
import StatsTable from '../atom/statstble';
import { FireIcon, FirstAidIcon, HandshakeIcon, PercentIcon, PlusCircleIcon, SkullIcon, SwordIcon, UsersIcon } from '@phosphor-icons/react';
import type { GroupKey } from '../../types/roster';
import { formatPercent } from '../../utils/format';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { NWayToggle } from '../atom/nwaytoggle';
import { companyGroupSummary, joinedRoster, splitRoster } from '../../utils/groups';

interface GroupsSummaryProps {
    groups?: Map<GroupKey, GroupPerformance>;
}
export function GroupsSummary({ groups }: GroupsSummaryProps): JSX.Element {
    const [qdpsSplit, setQdpsSplit] = useLocalStorage<'Joined' | 'Split' | 'Both'>('qdpsSplit', 'Joined');
    const [aoeSplit, setAoeSplit] = useLocalStorage<'Include' | 'Exclude'>('aoeSplit', 'Include');
    const hasQdps = useMemo(() => {
        return Array.from(groups?.keys() || []).some(v => typeof v !== 'number');
    }, [groups]);

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

    const splitRoles = useMemo(() => aoeSplit === 'Exclude' ? ['aoe'] : undefined, [aoeSplit]);

    const data: Array<StatTotals> = React.useMemo(() => {
        if (!groups) return [];
        let filteredGroups = groups;
        if (qdpsSplit === 'Joined') {
            filteredGroups = joinedRoster(groups);
        } else if (qdpsSplit === 'Split') {
            filteredGroups = splitRoster(groups);
        }

        const summary = companyGroupSummary(filteredGroups);
        if (splitRoles) {
            for (const [gk, group] of filteredGroups) {
                for (const stat of group.stats) {
                    if (stat.role.name) {
                        if (splitRoles.some(v => stat.role.name.toLowerCase().includes(v))) {
                            summary.get(gk)!.healing -= stat.healing;
                        }
                    }
                }
            }
        }
        return Array.from(summary.keys())
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
                if (keyA === 'weak') return -1;
                return 1; // keyB === 'Weak' or keyA === 'Strong' > keyB === 'Strong'
            })
            .map(key => summary.get(key))
            .filter((item): item is StatTotals => item !== undefined);
    }, [groups, qdpsSplit, splitRoles]);

    return (
        <div className="flex flex-col gap-2 w-full ">
            <div className=''>
                <div className='flex flex-row items-center h-full mb-2 gap-2'>
                    <span className="">QDPS arrangement</span>
                    <NWayToggle
                        className="text-small px-2 py-1"
                        defaultValue={qdpsSplit}
                        options={['Joined', 'Split', 'Both']}
                        onChange={(value) =>
                            setQdpsSplit(value as 'Joined' | 'Split' | 'Both')
                        }
                        disabled={!hasQdps}
                    />
                    <span className="">AoE healing</span>
                    <NWayToggle
                        className="text-small px-2 py-1"
                        defaultValue={aoeSplit}
                        options={['Include', 'Exclude']}
                        onChange={(value) => {
                            setAoeSplit(value as 'Include' | 'Exclude')
                        }}
                        disabled={false}
                    />
                </div>
                {groups ? (
                    <div className=""><StatsTable columns={columns} data={data} /></div>
                ) : (<div className='text-gray-500 p-2'>No data</div>)}
            </div>
        </div >
    );
};
