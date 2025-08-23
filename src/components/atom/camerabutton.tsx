import { CameraIcon, CircleNotchIcon } from "@phosphor-icons/react";
import type { JSX } from "react";

interface CameraButtonProps {
    onClick: () => {};
    loading?: boolean
}
export function CameraButton({ onClick, loading }: CameraButtonProps): JSX.Element {

    return (
        <button
            onClick={onClick}
            className={`absolute top-0 right-4 p-3 rounded-full text-white shadow-lg transition ${loading ? "bg-gray-600" : "bg-blue-600 hover:bg-blue-700"
                }`}
        >
            {loading ? (
                <CircleNotchIcon className="animate-spin" weight="fill" size={24} />
            ) : (
                <CameraIcon weight="fill" size={24} />
            )}
        </button>
    );
}
