import type { JSX } from "react";
import ProfilePicture from "../atom/profilepicture";
import type { Character } from "../../types/character";
import { factionBgPrimary } from "../../utils/factions";


export interface PlayerCardProps {
    player: Character
}
function CharacterCard({ player }: PlayerCardProps): JSX.Element {
    let color = factionBgPrimary(player.faction)

    return (
        <div className="flex flex-row">
            <div className={`${color} p-4`}></div>
            <div className={`flex items-center bg-gray-700 rounded-tr-lg p-2 gap-2 w-full`}>
                <ProfilePicture pictureUrl="https://dqzvgunkova5o.cloudfront.net/statics/2025-06-20/images/NW-bug.svg" size={32} />
                <div className="flex flex-col">
                    <div className="flex items-end text-white gap-2">
                        <div className="text-3xl font-semibold ">{player.name}</div>
                        <div>{player.role}</div>
                    </div>
                    <div className="flex gap-2 items-end text-white ">
                        <div>{player.faction !== 'Gray' && player.faction}</div>
                        {player.faction !== 'Gray' && player.company && <div>|</div>}
                        <div>{player.company}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CharacterCard;
