import { useEffect, useState } from "react";
import type { Character } from "../../types/character";
import { kCharacterColumns } from "../../mapping/charactersmap";
import { Qop } from "../../types/queryparameter";
import { getCharacters } from "../../services/characterservice";


export interface UseCharactersOptions {
    comapny?: string
}
export function useCharacters(options?: UseCharactersOptions) {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<any>(null);
    const [members, setMemebrs] = useState<Character[]>([]);

    useEffect(() => {
        let cancelled = false;
        async function fetchAll() {
            try {
                setLoading(true);
                let m: Character[] = [];
                if (options?.comapny) {
                    m = await getCharacters([{ column: kCharacterColumns.company, fn: Qop.Eq, value: options?.comapny }]);
                }
                if (cancelled) return;
                setMemebrs(m);
            } catch (err) {
                if (!cancelled) setError(err);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        fetchAll();
        return () => { cancelled = true };
    }, [options?.comapny]);

    return { loading, error, members };
}
