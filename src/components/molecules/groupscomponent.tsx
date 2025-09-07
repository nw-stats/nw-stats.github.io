
// import { useMemo, useRef, useState } from 'react';
// import type { GroupPerformance, StatTotals } from '../../types/leaderboard';
// import GroupsDetail from './groupsdetails';
// import type { GroupNumber } from '../../types/roster';
// import { NWayToggle } from '../atom/nwaytoggle';
// import { joinedRoster, splitRoster } from '../../utils/groups';
// import { useLocalStorage } from '../../hooks/useLocalStorage';

// interface GroupsSummaryProps {
//     attackerName: string,
//     defenderName: string,
//     hideRoles: boolean,
//     attackerGroups?: Map<GroupNumber, GroupPerformance>;
//     defenderGroups?: Map<GroupNumber, GroupPerformance>;
//     attackerSummary?: Map<GroupNumber, StatTotals>;
//     defenderSummary?: Map<GroupNumber, StatTotals>;
// }
// const GroupsComponent: React.FC<GroupsSummaryProps> = ({
//     attackerName,
//     defenderName,
//     attackerGroups,
//     defenderGroups,
//     attackerSummary,
//     defenderSummary,
//     hideRoles
// }) => {
//     const [company, setCompany] = useState(0);
//     const [qdpsSplit, setQdpsSplit] = useLocalStorage<'Joined' | 'Split' | 'Both'>('qdpsSplit', 'Joined');

//     // const selectedSummary = company === 0 ? attackerSummary : defenderSummary;
//     const selectedGroups = company === 0 ? attackerGroups : defenderGroups;
//     const screenshotRef = useRef<HTMLDivElement>(null);

//     let filteredGroups = selectedGroups;
//     // let filteredSummaries = selectedSummary;
//     if (filteredGroups) {
//         if (qdpsSplit === 'Joined' && filteredGroups) {
//             filteredGroups = joinedRoster(filteredGroups);
//         } else if (qdpsSplit === 'Split') {
//             filteredGroups = splitRoster(filteredGroups);
//         }
//         // filteredSummaries = companyGroupSummary(filteredGroups);
//     }

//     const attackerHasQdps = useMemo(() => {
//         return Array.from(attackerSummary?.keys() || []).some(v => typeof v !== 'number');
//     }, [attackerSummary]);
//     const defenderHasQdps = useMemo(() => {
//         return Array.from(defenderSummary?.keys() || []).some(v => typeof v !== 'number');
//     }, [attackerSummary]);

//     const eitherTeamHasQpds = attackerHasQdps || defenderHasQdps;
//     const selectedTeamHasQpds = company === 1 ? attackerHasQdps : defenderHasQdps;

//     return (
//         <div className='text-white'>
//             <div className="flex w-full p-2">
//                 <div className="flex flex-row justify-between items-start w-full">
//                     {/* Left controls */}
//                     <div className="flex flex-col gap-2">
//                         <NWayToggle
//                             className="px-3 py-2 text-md"
//                             options={[attackerName, defenderName]}
//                             onChange={(_, index) => setCompany(index)}
//                         />
//                         {eitherTeamHasQpds && (
//                             <div className="flex flex-row gap-2 items-center">
//                                 <span>QDPS arrangement</span>
//                                 <NWayToggle
//                                     className="text-small px-2 py-1"
//                                     defaultValue={qdpsSplit}
//                                     options={['Joined', 'Split', 'Both']}
//                                     onChange={(value) =>
//                                         setQdpsSplit(value as 'Joined' | 'Split' | 'Both')
//                                     }
//                                     disabled={selectedTeamHasQpds}
//                                 />
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </div>

//             <div className='grid grid-cols-1 gap-8' ref={screenshotRef}>
//                 {/* <GroupsSummary groups={filteredSummaries} /> */}
//                 <GroupsDetail groups={filteredGroups} hideRoles={hideRoles} />
//             </div>
//         </div >
//     );
// };

// export default GroupsComponent;
