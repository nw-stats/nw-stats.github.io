import { createContext, useContext } from "react";
import type { Season } from "../../constants/sheets";

type SeasonContextValue = {
    season: Season;
    setSeason: (season: Season) => void;
};

export const SeasonContext = createContext<SeasonContextValue | null>(null);

export function useSeason() {
    const context = useContext(SeasonContext);

    if (!context) {
        throw new Error("useSeason must be used within SeasonProvider");
    }

    return context;
}
