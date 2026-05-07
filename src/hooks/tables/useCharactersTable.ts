import { useEffect, useState } from "react";
import { getCharactersTable } from "../../services/characterservice";
import type { CharacterRow } from "../../types/db/characterrow";

export function useCharactersTable() {
    const [characterTable, setCharacterTable] = useState<CharacterRow[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<any>(null);

    useEffect(() => {
        let cancelled = false;
        async function fetchAll() {
            setLoading(true);
            try {
                const ct = await getCharactersTable();
                if (cancelled) return;
                setCharacterTable(ct)
            } catch (err) {
                setError(err)
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        fetchAll();
        return () => { cancelled = true };
    }, []);
    return { loading, error, characterTable };
}
