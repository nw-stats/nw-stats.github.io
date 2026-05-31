import { useEffect, useState } from 'react'
import { getAlts } from '../../services/altservice'
import { getCharacters } from '../../services/characterservice'
import { Qop } from '../../types/queryparameter'
import type { Character } from '../../types/character'
import { kCharacterColumns } from '../../mapping/charactersmap'

export function useAlts(sheetId: string, player?: string) {
    const [alts, setAlts] = useState<Character[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<Error | null>(null)

    useEffect(() => {
        let cancelled = false

        async function fetchAlts() {
            if (!player) {
                setAlts([])
                return
            }

            setLoading(true)
            setError(null)

            try {
                const names = await getAlts(sheetId, player)
                if (cancelled) return

                if (names.length === 0) {
                    setAlts([])
                    return
                }

                const queries = names.map(name => ({
                    column: kCharacterColumns.character,
                    fn: Qop.Eq,
                    value: name,
                }))

                const characters = await getCharacters(sheetId, queries)

                if (cancelled) return

                setAlts(characters)
            } catch (err) {
                if (!cancelled) {
                    setError(err instanceof Error
                        ? err
                        : new Error('Failed to load alts'))
                }
            } finally {
                if (!cancelled) {
                    setLoading(false)
                }
            }
        }

        fetchAlts()

        return () => {
            cancelled = true
        }
    }, [player, sheetId])

    return {
        alts,
        loading,
        error,
    }
}
