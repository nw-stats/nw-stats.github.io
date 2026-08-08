import { useCallback } from "react";
import type { DateTime } from "luxon";
import { getAnnoucements } from "../services/annoucementsservice";
import type { AnnouncementsRow } from "../types/db/announcementrow";
import { useFetch } from "./useFetch";

export default function useAnnouncements(expires: DateTime) {
    const fetcher = useCallback(() => getAnnoucements(expires), [expires]);
    const { data: announcements, loading, error } = useFetch<AnnouncementsRow[]>(fetcher, []);
    return { announcements, loading, error };
}
