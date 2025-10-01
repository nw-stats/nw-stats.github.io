import type { JSX } from "react";
import type { Character } from "../../types/character";
import ProfilePicture from "./profilepicture";
import { Link } from "react-router-dom";
import { factionBgPrimary } from "../../utils/factions";

interface PlayerListCardProps {
    character: Character

}

function CharacterListCard({ character }: PlayerListCardProps): JSX.Element {
    const color = factionBgPrimary(character.faction);

    return (
        <Link to={`/players/${character.name}`}>
            <div className="flex flex-row">
                <div className={`${color} rounded-l-lg p-4`}></div>
                <div className={`flex items-center bg-gray-700 rounded-r-lg p-2 gap-2 w-full`}>
                    <ProfilePicture pictureUrl="https://dqzvgunkova5o.cloudfront.net/statics/2025-06-20/images/NW-bug.svg" size={32} />
                    <div className="flex flex-col">
                        <div className="flex flex-row items-end text-white gap-2">
                            <div className="text-lg font-semibold ">{character.name}</div>
                        </div>
                        <div className="flex flex-row gap-2 items-end text-white text-xs">
                            <div>{character.faction !== 'Gray' && character.faction}</div>
                            {character.faction !== 'Gray' && character.company && <div>|</div>}
                            <div>{character.company?.name}</div>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default CharacterListCard;
