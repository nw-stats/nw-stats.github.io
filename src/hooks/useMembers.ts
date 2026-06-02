import { useEffect, useState } from "react";
import { getCharacters as getCharacters } from "../services/characterservice";
import { Qop } from "../types/queryparameter";
import type { Character } from "../types/character";
import { kCharacterColumns } from "../mapping/charactersmap";
import type { SheetId } from "../constants/sheets";

export function useMembers(sheetId: SheetId, company: string) {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<unknown>(null);
    const [members, setMemebrs] = useState<Character[]>([]);

    useEffect(() => {
        let cancelled = false;
        async function fetchAll() {
            try {
                setLoading(true);
                const m = await getCharacters(sheetId, [{ column: kCharacterColumns.company, fn: Qop.Eq, value: company }]);
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
    }, [company, sheetId]);

    return { loading, error, members };
}
