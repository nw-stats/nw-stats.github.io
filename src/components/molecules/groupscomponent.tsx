
import { useState } from 'react';
import type { GroupPerformance, StatTotals } from '../../types/leaderboard';
import GroupsDetail from './groupsdetails';
import GroupsSummary from './groupssummary';
import type { GroupKey } from '../../types/roster';
import { NWayToggle } from '../atom/nwaytoggle';
import { companyGroupSummary, joinedRoster, splitRoster } from '../../utils/groups';
import { useLocalStorage } from '../../hooks/useLocalStorage';

interface GroupsSummaryProps {
    attackerName: string,
    defenderName: string,
    attackerGroups?: Map<GroupKey, GroupPerformance>;
    defenderGroups?: Map<GroupKey, GroupPerformance>;
    attackerSummary?: Map<GroupKey, StatTotals>;
    defenderSummary?: Map<GroupKey, StatTotals>;
}
const GroupsComponent: React.FC<GroupsSummaryProps> = ({
    attackerName,
    defenderName,
    attackerGroups,
    defenderGroups,
    attackerSummary,
    defenderSummary
}) => {
    const [company, setCompany] = useState(0);
    const [qdpsSplit, setQdpsSplit] = useLocalStorage<'Joined' | 'Split' | 'Both'>('qdpsSplit', 'Joined');
    const selectedSummary = company === 0 ? attackerSummary : defenderSummary;
    const selectedGroups = company === 0 ? attackerGroups : defenderGroups;

    let filteredGroups = selectedGroups;
    let filteredSummaries = selectedSummary;
    if (filteredGroups) {
        if (qdpsSplit === 'Joined' && filteredGroups) {
            filteredGroups = joinedRoster(filteredGroups);
        } else if (qdpsSplit === 'Split') {
            filteredGroups = splitRoster(filteredGroups);
        }
        filteredSummaries = companyGroupSummary(filteredGroups);
    }

    return (
        <div className='text-white'>

            <div className="flex p-2">
                <div className="flex flex-col gap-2">
                    <NWayToggle className='px-3 py-2 text-md' options={[attackerName, defenderName]} onChange={(_, index) => setCompany(index)} />
                    <div className="flex flex-row gap-2 items-center">
                        <span>QDPS arrangement</span>
                        <NWayToggle className='text-small px-2 py-1' defaultValue={qdpsSplit} options={['Joined', 'Split', 'Both']} onChange={(value) => setQdpsSplit(value as 'Joined' | 'Split' | 'Both')} />
                    </div>
                </div>
            </div>

            <div className='grid grid-cols-1 gap-8'>
                <GroupsSummary groups={filteredSummaries} />
                <GroupsDetail groups={filteredGroups} />
            </div>
        </div>
    );

};

export default GroupsComponent;
