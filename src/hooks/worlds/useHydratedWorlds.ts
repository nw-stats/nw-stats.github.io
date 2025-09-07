import { useQuery } from "@tanstack/react-query";
import type { World } from "../../types/world";
import { getWorlds } from "../../services/worlds/worldservice";
import { hydrateWorlds } from "../../services/worlds/hydrateWorlds";
import { RETRY, STALE_TIME } from "../../constants/query";

export function useHydratedWorlds() {
    return useQuery<World[], Error>({
        queryKey: ["worlds"],
        queryFn: async () => {
            const worlds = await getWorlds();
            return hydrateWorlds(worlds);
        },
        staleTime: STALE_TIME,
        retry: RETRY
    });
}
