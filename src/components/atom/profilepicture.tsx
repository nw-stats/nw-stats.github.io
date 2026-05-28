import type { JSX } from "react";

interface ProfilePictureProps {
    pictureUrl: string;
    size: number;
}

export default function deProfilePicture({ pictureUrl, size }: ProfilePictureProps): JSX.Element {
    return (
        <div
            className="overflow-hidden rounded-2xl border border-white/25 bg-white/5 shadow-lg"
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
