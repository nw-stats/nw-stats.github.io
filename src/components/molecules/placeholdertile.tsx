import { type JSX } from "react";


function PlaceholderTile(): JSX.Element {
    return (
        <div className="col-span-4">
            <div className="bg-gray-800 text-white w-full h-full flex items-center justify-center rounded-lg relative p-4">
                Nothing is scheduled.
            </div>
        </div>
    );
}

export default PlaceholderTile;
