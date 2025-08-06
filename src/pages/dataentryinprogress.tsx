import type { JSX } from "react";
import { NavLink } from "react-router-dom";

function DataEntryInProgress(): JSX.Element {
    return (
        <div className="text-center text-white p-8">
            <h1 className="text-4xl font-bold mb-4">Leaderboard not ready yet!</h1>
            <NavLink to="/" className="text-blue-400 underline">Go back home</NavLink>
            <img src="https://lh3.googleusercontent.com/d/1ZqvvQ3Rrx-ZVplQMEGU1fC0Aujay1tE-"
                className="w-full m-8 mx-auto max-w-sm"></img>
        </div>
    );
}

export default DataEntryInProgress;
