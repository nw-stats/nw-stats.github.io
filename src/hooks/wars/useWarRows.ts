import { useQuery } from "@tanstack/react-query";
import type { WarRow } from "../../schemas/war";
import { getWars } from "../../services/wars.ts/warservice";
import { Qop } from "../../services/googlesheets/queryparameter";
import { RETRY, STALE_TIME } from "../../constants/query";
import type { UseWarsOptions } from "./warOptions";

function fetchWarsById(warIds: number[]): Promise<WarRow[]> {
    const params = warIds.map(id => ({
        field: "id" as const,
        operator: Qop.Eq,
        value: id,
    }));
    return getWars(params);
}

async function fetchWarsByCompanies(companyNames: string[]): Promise<WarRow[]> {
    const attackerParams = companyNames.map(name => ({
        field: "attacker" as const,
        operator: Qop.Eq,
        value: name,
    }));

    const defenderParams = companyNames.map(name => ({
        field: "defender" as const,
        operator: Qop.Eq,
        value: name,
    }));

    const [asAttacker, asDefender] = await Promise.all([
        getWars(attackerParams),
        getWars(defenderParams),
    ]);

    const merged = [...asAttacker, ...asDefender];
    const unique = new Map<number, WarRow>();
    for (const war of merged) unique.set(war.id, war);
    return Array.from(unique.values());
}

function fetchWarsAll(): Promise<WarRow[]> {
    return getWars();
}

export function useWarRows({ warIds, companies, enabled }: UseWarsOptions = {}) {
    return useQuery<WarRow[], Error>({
        queryKey: ["warRows", warIds, companies],
        queryFn: () => {
            if (warIds?.length) return fetchWarsById(warIds);
            if (companies?.length) return fetchWarsByCompanies(companies);
            return fetchWarsAll();
        },
        staleTime: STALE_TIME,
        retry: RETRY,
        enabled: enabled ?? true,
    });
}
