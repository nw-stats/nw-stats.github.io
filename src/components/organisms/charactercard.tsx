// import type { JSX } from "react";
// import ProfilePicture from "../atom/profilepicture";
// import type { Character } from "../../types/character";
// import { factionBgPrimary } from "../../utils/factions";


// export interface PlayerCardProps {
//     player: Character
// }
// function CharacterCard({ player }: PlayerCardProps): JSX.Element {
//     const color = factionBgPrimary(player.faction)

//     return (
//         <div className="flex flex-row">
//             <div className={`${color} p-4`}></div>
//             <div className={`flex items-center bg-surface-1rounded-tr-lg p-2 gap-2 w-full`}>
//                 <ProfilePicture pictureUrl="https://dqzvgunkova5o.cloudfront.net/statics/2025-06-20/images/NW-bug.svg" size={32} />
//                 <div className="flex flex-col">
//                     <div className="flex items-end text-foreground gap-2">
//                         <div className="text-3xl font-semibold ">{player.name}</div>
//                     </div>
//                     <div className="flex gap-2 items-end text-foreground ">
//                         <div>{player.faction !== 'Gray' && player.faction}</div>
//                         {player.faction !== 'Gray' && player.company && <div>|</div>}
//                         <div>{player.company}</div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default CharacterCard;


import type { JSX } from "react";
import ProfilePicture from "../atom/profilepicture";
import type { Character } from "../../types/character";
import { factionBgPrimary } from "../../utils/factions";

export interface PlayerCardProps {
    player: Character;
}
const cardBase =
    "rounded-lg bg-background shadow-sm ring-1 ring-gray-700/50 overflow-hidden";
export default function CharacterCard({ player }: PlayerCardProps): JSX.Element {
    const color = factionBgPrimary(player.faction);

    return (
        <div className={`${cardBase} flex items-center`}>
            {/* faction bar */}
            <div className={`w-2 self-stretch ${color}`} />

            <div className="flex items-center gap-3 p-4 w-full">
                <ProfilePicture
                    pictureUrl="https://dqzvgunkova5o.cloudfront.net/statics/2025-06-20/images/NW-bug.svg"
                    size={44}
                />

                <div className="flex flex-col leading-tight">
                    <div className="text-xl font-semibold text-foreground">
                        {player.name}
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-400">
                        {player.faction !== "Gray" && (
                            <span className="text-gray-300 font-medium">
                                {player.faction}
                            </span>
                        )}

                        {player.faction !== "Gray" && player.company && (
                            <span className="text-gray-600">•</span>
                        )}

                        <span>{player.company}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
