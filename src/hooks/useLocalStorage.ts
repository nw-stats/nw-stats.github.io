import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, defaultValue: T) {
    const [value, setValue] = useState<T>(() => {
        try {
            const stored = localStorage.getItem(key);
            if (!stored) return defaultValue;
            const parsed = JSON.parse(stored);
            const returnVale = stored ? parsed as T : defaultValue;
            return returnVale;
        } catch {
            return defaultValue;
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch { }
    }, [key, value]);


    return [value, setValue] as const;
}
