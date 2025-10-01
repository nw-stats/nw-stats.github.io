import { useQuery } from "@tanstack/react-query";
import type { PlayerRow } from "../../schemas/player";
import type { usePlayerOptions } from "./playerOptions";
import { RETRY, STALE_TIME } from "../../constants/query";
import { getPlayers } from "../../services/players/playaerservice";
import { Qop } from "../../services/googlesheets/queryparameter";

export function usePlayerRows({ names, enabled }: usePlayerOptions) {
    return useQuery<PlayerRow[], Error>({
        queryKey: ['playerRows', names],
        queryFn: async () => {
            const parms = (names
                ? names.map(item => ({
                    field: 'name' as const,
                    operator: Qop.Eq,
                    value: item,
                }))
                : undefined)
            return await getPlayers(parms);
        },
        staleTime: STALE_TIME,
        retry: RETRY,
        enabled: enabled ?? true,
    });
}
