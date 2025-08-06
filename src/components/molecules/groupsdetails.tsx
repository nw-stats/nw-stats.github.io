import React from 'react';
import type { GroupPerformance } from '../../types/leaderboard';
import GroupDisplay from './groupdisplay';
import type { GroupKey } from '../../types/roster';

interface GroupsDetailProps {
    groups?: Map<GroupKey, GroupPerformance>;
}

const GroupsDetail: React.FC<GroupsDetailProps> = ({ groups }) => {

    const rows = []
    if (groups) {
        const sortedGroups = Array.from(groups.entries()).sort((a, b) => {
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
            if (keyA === 'Weak') return -1;
            return 1; // keyB === 'Weak' or keyA === 'Strong' > keyB === 'Strong'
        });
        for (const [n, group] of sortedGroups) {
            rows.push(
                <div className="w-full overflow-x-auto" key={n}>
                    <GroupDisplay group={group} groupId={n} />
                </div>
            )
        }
    }



    return (
        <div className="rounded-lg grid grid-cols-1 lg:grid-cols-2 gap-8">
            {rows}
        </div>
    );
};

export default GroupsDetail;
