import type { JSX } from "react";
import { Link } from "react-router-dom";
import type { Player } from "../../types/player";
import ProfilePicture from "./profilepicture";

interface PlayerListCardProps {
    player: Player;
}
export function PlayerListCard({ player }: PlayerListCardProps): JSX.Element {
    return (
        <Link to={`/players/${player.name}`}>
            <div className="flex flex-row">
                <div className={`rounded-l-lg p-4`}></div>
                <div className={`flex items-center bg-gray-700 rounded-r-lg p-2 gap-2 w-full`}>
                    <ProfilePicture pictureUrl="https://dqzvgunkova5o.cloudfront.net/statics/2025-06-20/images/NW-bug.svg" size={32} />
                    <div className="flex flex-col">
                        <div className="flex flex-row items-end text-white gap-2">
                            <div className="text-lg font-semibold ">{player.name}</div>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    )
}
