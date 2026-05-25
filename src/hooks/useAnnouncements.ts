import type { DateTime } from "luxon";
import { useEffect, useState } from "react";
import { getAnnoucements } from "../services/annoucementsservice";
import type { AnnouncementsRow } from "../types/db/announcementrow";

export default function useAnnouncements(expires: DateTime) {
    const [announcements, setAnnouncements] = useState<AnnouncementsRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<unknown>(null);

    useEffect(() => {
        let cancelled = false;

        async function fetchData() {
            try {
                setLoading(true);
                const a = await getAnnoucements(expires);
                if (cancelled) return;
                setAnnouncements(a);

            } catch (err) {
                if (!cancelled) setError(err);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        fetchData();
        return () => {
            cancelled = true; // Prevent state update on unmounted component
        };
    }, [expires]);

    return { error, loading, announcements };
}
