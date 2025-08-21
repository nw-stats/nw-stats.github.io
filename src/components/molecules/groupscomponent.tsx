
import { useRef, useState } from 'react';
import type { GroupPerformance, StatTotals } from '../../types/leaderboard';
import GroupsDetail from './groupsdetails';
import GroupsSummary from './groupssummary';
import type { GroupKey } from '../../types/roster';
import { NWayToggle } from '../atom/nwaytoggle';
import { companyGroupSummary, joinedRoster, splitRoster } from '../../utils/groups';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { CameraIcon, CircleNotchIcon } from '@phosphor-icons/react';
import { toPng } from 'html-to-image';

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
    const [ssLoading, setSsLoading] = useState<Boolean>(false);

    const selectedSummary = company === 0 ? attackerSummary : defenderSummary;
    const selectedGroups = company === 0 ? attackerGroups : defenderGroups;
    const screenshotRef = useRef<HTMLDivElement>(null);

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

    const handleScreenshot = async () => {
        if (!screenshotRef.current) return;
        try {
            setSsLoading(true);
            await new Promise(resolve => setTimeout(resolve, 0));

            const dataUrl = await toPng(screenshotRef.current, {
                backgroundColor: "#1f2937",
                cacheBust: true,
                skipFonts: true,
            });
            const link = document.createElement("a");
            link.download = "leaderboard.png";
            link.href = dataUrl;
            link.click();
        } finally {
            setSsLoading(false);
        }
    };

    const hasQdps = Array.from(attackerSummary?.keys() || []).concat(Array.from(defenderSummary?.keys() || [])).some(v => typeof v !== 'number');

    return (
        <div className='text-white'>
            <div className="flex w-full p-2">
                <div className="flex flex-row justify-between items-start w-full">
                    {/* Left controls */}
                    <div className="flex flex-col gap-2">
                        <NWayToggle
                            className="px-3 py-2 text-md"
                            options={[attackerName, defenderName]}
                            onChange={(_, index) => setCompany(index)}
                        />
                        {hasQdps && (
                            <div className="flex flex-row gap-2 items-center">
                                <span>QDPS arrangement</span>
                                <NWayToggle
                                    className="text-small px-2 py-1"
                                    defaultValue={qdpsSplit}
                                    options={['Joined', 'Split', 'Both']}
                                    onChange={(value) =>
                                        setQdpsSplit(value as 'Joined' | 'Split' | 'Both')
                                    }
                                />
                            </div>
                        )}
                    </div>

                    {/* Right screenshot button */}
                    <button
                        onClick={handleScreenshot}
                        className={`p-2 rounded-full text-white ${ssLoading ? "bg-gray-600" : "bg-blue-600 hover:bg-blue-700"}`}
                    >
                        {ssLoading ? (
                            <CircleNotchIcon className="animate-spin" weight="fill" size={24} />
                        ) : (
                            <CameraIcon weight="fill" size={24} />
                        )}
                    </button>
                </div>
            </div>

            <div className='grid grid-cols-1 gap-8 pl-2 pr-2 pb-2' ref={screenshotRef}>
                <GroupsSummary groups={filteredSummaries} />
                <GroupsDetail groups={filteredGroups} />
            </div>
        </div >
    );
};

export default GroupsComponent;
