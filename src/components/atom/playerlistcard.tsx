import type { JSX } from "react";
import type { Character } from "../../types/character";
import ProfilePicture from "./profilepicture";
import { Link } from "react-router-dom";
import { factionBgPrimary } from "../../utils/factions";

interface PlayerListCardProps {
    player: Character

}

function PlayerListCard({ player }: PlayerListCardProps): JSX.Element {
    const color = factionBgPrimary(player.faction);

    return (
        <Link to={`/players/${player.name}`}>
            <div className="flex flex-row">
                <div className={`${color} rounded-l-lg p-4`}></div>
                <div className={`flex items-center bg-gray-700 rounded-r-lg p-2 gap-2 w-full`}>
                    <ProfilePicture pictureUrl="https://dqzvgunkova5o.cloudfront.net/statics/2025-06-20/images/NW-bug.svg" size={32} />
                    <div className="flex flex-col">
                        <div className="flex flex-row items-end text-white gap-2">
                            <div className="text-lg font-semibold ">{player.name}</div>
                            <div className="text-xs">{player.role}</div>
                        </div>
                        <div className="flex flex-row gap-2 items-end text-white text-xs">
                            <div>{player.faction !== 'Gray' && player.faction}</div>
                            {player.faction !== 'Gray' && player.company && <div>|</div>}
                            <div>{player.company}</div>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default PlayerListCard;
