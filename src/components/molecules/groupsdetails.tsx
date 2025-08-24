import React, { useMemo } from 'react';
import type { GroupPerformance } from '../../types/leaderboard';
import GroupDisplay from './groupdisplay';
import type { GroupKey } from '../../types/roster';
import { joinedRoster, splitRoster } from '../../utils/groups';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { NWayToggle } from '../atom/nwaytoggle';

interface GroupsDetailProps {
    hideRoles: boolean
    groups?: Map<GroupKey, GroupPerformance>;
}

const GroupsDetail: React.FC<GroupsDetailProps> = ({ hideRoles, groups }) => {
    const [qdpsSplit, setQdpsSplit] = useLocalStorage<'Joined' | 'Split' | 'Both'>('qdpsSplit', 'Joined');
    const [aoeSplit, setAoeSplit] = useLocalStorage<'Include' | 'Exclude'>('aoeSplit', 'Include');

    const hasQdps = useMemo(() => {
        return Array.from(groups?.keys() || []).some(v => typeof v !== 'number');
    }, [groups]);

    const splitRoles = useMemo(() => aoeSplit === 'Exclude' ? ['aoe'] : undefined, [aoeSplit]);

    const sortedGroups = useMemo(() => {
        if (!groups) return [];

        let filteredGroups = groups;
        if (qdpsSplit === "Joined") {
            filteredGroups = joinedRoster(groups);
        } else if (qdpsSplit === "Split") {
            filteredGroups = splitRoster(groups);
        }

        return Array.from(filteredGroups.entries()).sort((a, b) => {
            const keyA = a[0];
            const keyB = b[0];

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
        });

    }, [qdpsSplit]);

    return (
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
            <div className="rounded-lg grid grid-cols-1 lg:grid-cols-2 gap-8">
                {sortedGroups.map((v) => (
                    <div className="w-full overflow-x-auto" key={v[0]}>
                        <GroupDisplay group={v[1]} groupId={v[0]} hideRoles={hideRoles} splitRoles={splitRoles} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GroupsDetail;
