import { useCallback } from "react";
import type { World } from "../../types/world";
import { getWorlds } from "../../services/worldservice";
import { useFetch } from "../useFetch";

const fetchWorlds = () => getWorlds();

export function useWorlds() {
    const fetcher = useCallback(fetchWorlds, []);
    const { data: worlds, loading, error } = useFetch<World[]>(fetcher, []);
    return { worlds, loading, error };
}
