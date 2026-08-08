import { useEffect, useState } from "react";

export function useFetch<T>(fetcher: () => Promise<T>, initialValue: T) {
    const [data, setData] = useState<T>(initialValue);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<unknown>(null);

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        setError(null);
        fetcher()
            .then(result => { if (!cancelled) setData(result); })
            .catch(err => { if (!cancelled) setError(err); })
            .finally(() => { if (!cancelled) setLoading(false); });
        return () => { cancelled = true; };
    }, [fetcher]);

    return { data, loading, error };
}
