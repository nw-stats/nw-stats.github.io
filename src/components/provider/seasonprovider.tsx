import { useState, type JSX } from "react";
import { DEFAULT_SEASON, type Season } from "../../constants/sheets";
import { SeasonContext } from "../../hooks/base/useSeason";

type Props = {
    children: React.ReactNode;
};

export function SeasonProvider({ children }: Props): JSX.Element {
    const [season, setSeason] = useState<Season>(DEFAULT_SEASON);

    return (
        <SeasonContext.Provider
            value={{
                season,
                setSeason,
            }
            }
        >
            {children}
        </SeasonContext.Provider>
    );
}
