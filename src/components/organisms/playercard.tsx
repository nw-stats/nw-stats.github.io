import type { JSX } from "react";
import type { PlayerRow } from "../../types/db/playerrow";
import ProfilePicture from "../atom/profilepicture";

const cardBase =
    "rounded-lg bg-background shadow-sm ring-1 ring-gray-700/50 overflow-hidden";
interface PlayerCardProps {
    player: PlayerRow;
}
export default function PlayerCard({ player }: PlayerCardProps): JSX.Element {
    const picture = player.picture
        ? player.picture
        : "https://dqzvgunkova5o.cloudfront.net/statics/2025-06-20/images/NW-bug.svg";
    return (
        <div className={`${cardBase} flex items-center`}>
            <div className="flex items-center gap-3 p-4 w-full">
                <ProfilePicture
                    pictureUrl={picture}
                    size={44}
                />

                <div className="flex flex-col leading-tight">
                    <div className="text-xl font-semibold text-foreground">
                        {player.name}
                    </div>
                </div>
            </div>
        </div>
    );
}
