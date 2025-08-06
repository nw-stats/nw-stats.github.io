// import React from "react";
// import { Link } from "react-router-dom";
// import {
//     Fire,
//     Skull,
//     Sword,
//     Handshake,
//     PlusCircle,
//     MapTrifold,
//     Calendar,
// } from "phosphor-react";
// import type { LeaderboardEntry } from "../../types/leaderboard";

// interface PlayerMatchHistoryProps {
//     entries: LeaderboardEntry[];
// }

// const PlayerMatchHistory: React.FC<PlayerMatchHistoryProps> = ({ entries }) => {
//     if (entries.length === 0) {
//         return <div className="text-gray-400">No matches found.</div>;
//     }




//     return (
//         <div className="space-y-4">
//             {entries.map((match, i) => (
//                 <Link key={match.matchId ?? i} to={`/wars/${match.matchId}`}>
//                     <div className="bg-gray-800 rounded-lg p-4 shadow hover:shadow-lg transition-all">
//                         <div className="flex justify-between text-sm text-gray-400 mb-2">
//                             <div className="flex items-center gap-1">
//                                 <MapTrifold size={16} />
//                                 <span>{match.map}</span>
//                             </div>
//                             <div className="flex items-center gap-1">
//                                 <Calendar size={16} />
//                                 <span>{match.date}</span>
//                             </div>
//                         </div>

//                         <div className="grid grid-cols-3 gap-2 text-sm text-gray-300">
//                             <Stat label="Score" value={match.score} icon={<PlusCircle size={16} />} />
//                             <Stat label="Kills" value={match.kills} icon={<Sword size={16} />} />
//                             <Stat label="Deaths" value={match.deaths} icon={<Skull size={16} />} />
//                             <Stat label="Assists" value={match.assists} icon={<HandshakeIcon size={16} />} />
//                             <Stat label="Healing" value={match.healing} icon={<Fire size={16} />} />
//                             <Stat label="Damage" value={match.damage} icon={<Fire size={16} />} />
//                         </div>
//                     </div>
//                 </Link>
//             ))}
//         </div>
//     );
// };

// interface StatProps {
//     label: string;
//     value: number;
//     icon: React.ReactNode;
// }

// const Stat: React.FC<StatProps> = ({ label, value, icon }) => (
//     <div className="flex items-center gap-2">
//         {icon}
//         <span>{label}:</span>
//         <span className="ml-auto font-semibold text-white">{value}</span>
//     </div>
// );

// export default PlayerMatchHistory;
