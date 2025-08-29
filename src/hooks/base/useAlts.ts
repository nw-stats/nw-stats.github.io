// src/hooks/useAlts.ts
import { useEffect, useState } from 'react';
import { getAlts } from '../../services/altservice';
import { getPlayers } from '../../services/characterservice';
import { Qop } from '../../types/queryparameter';
import type { Character } from '../../types/character';

export function useAlts(player: string) {
    const [alts, setAlts] = useState<Character[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        let cancelled = false;
        async function fetchData() {

            try {

                setLoading(true);
                if (!player) {
                    setAlts([]);
                }
                const names = await getAlts(player);
                if (cancelled) return;

                if (names.length > 0) {
                    const queries = names.map(v => ({ column: 'C', fn: Qop.Eq, value: v, }));
                    const players = await getPlayers(queries);
                    if (!cancelled) setAlts(players);
                } else {
                    setAlts([]);
                }
                setError(null);
            } catch (err) {
                if (!cancelled) {
                    setError(error);
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        fetchData();
        return () => {
            cancelled = true;
        };
    }, [player]);

    return { loading, error, alts };
}
