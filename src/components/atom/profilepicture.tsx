import type { JSX } from "react";

interface ProfilePictureProps {
    pictureUrl: string;
    size: number
}
function ProfilePicture({ pictureUrl, size }: ProfilePictureProps): JSX.Element {
    return (
        <div className="w-fit h-fit">
            <img src={pictureUrl} width={size} height={size}></img>
        </div>
    );
}

export default ProfilePicture
