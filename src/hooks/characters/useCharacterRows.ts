import { useQuery } from "@tanstack/react-query"
import type { CharacterRow } from "../../schemas/character";
import { Qop } from "../../services/googlesheets/queryparameter";
import { getCharacters } from "../../services/characters/characterservice";
import { RETRY, STALE_TIME } from "../../constants/query";
import type { UseCharacterRowOptions } from "./characterOptions";


function fetchByNames(names: string[]) {
    return getCharacters(names.map(item => ({
        field: "name" as const,
        operator: Qop.Eq,
        value: item,
    })));
}

function fetchByPlayers(players: string[]) {
    return getCharacters(players.map(item => ({
        field: 'player' as const,
        operator: Qop.Eq,
        value: item,
    })))
}

function fetchByCompanies(companyNames: string[]) {
    return getCharacters(companyNames.map(item => ({
        field: 'company' as const,
        operator: Qop.Eq,
        value: item,
    })));
}

function fetchAll() {
    return getCharacters();
}

export function useCharacterRows({
    names,
    players,
    companyNames,
    enabled
}: UseCharacterRowOptions = {}) {
    return useQuery<CharacterRow[], Error>({
        queryKey: ['characterRows', names],
        queryFn: async () => {
            if (names) return await fetchByNames(names);
            if (players) return await fetchByPlayers(players);
            if (companyNames) return await fetchByCompanies(companyNames);
            return await fetchAll();
        },
        staleTime: STALE_TIME,
        retry: RETRY,
        enabled: enabled ?? true,
    })
}
