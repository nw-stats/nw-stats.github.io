import type { JSX } from "react";
import type { Season } from "../../constants/sheets";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { SeasonContext } from "../../hooks/base/useSeason";

type Props = {
    children: React.ReactNode;
};

export function SeasonProvider({ children }: Props): JSX.Element {
    const [season, setSeason] = useLocalStorage<Season>(
        "season",
        "Season10"
    );

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
