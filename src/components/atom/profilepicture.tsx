import type { JSX } from "react";

interface ProfilePictureProps {
    pictureUrl: string;
    size: number
}
function ProfilePicture({ pictureUrl, size }: ProfilePictureProps): JSX.Element {
    return (
        <div
            className="overflow-hidden rounded-2xl"
            style={{
                width: size,
                height: size,
            }}
        >
            <img
                src={pictureUrl}
                alt="Profile"
                className="w-full h-full object-cover"
            />
        </div>
    );
}

export default ProfilePicture
