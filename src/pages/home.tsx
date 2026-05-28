
import { useMemo, type JSX } from "react";
import { Wars } from "./wars";
import Banner from "../components/organisms/banner";
import useAnnouncements from "../hooks/useAnnouncements";
import { DateTime } from "luxon";
import { DotIcon } from "@phosphor-icons/react";

export default function HomePage(): JSX.Element {
    const now = useMemo(() => DateTime.now(), []);
    const { loading, error, announcements } = useAnnouncements(now);
    const bannerReady = !loading && !error && announcements.length > 0;
    return (
        <div className="flex flex-col items-center">
            <div className="max-w-6xl w-full">
                <div
                    className={`
                        pt-4
            transition-all duration-500 ease-out
            overflow-hidden
            ${bannerReady
                            ? "opacity-100 translate-y-0 max-h-40"
                            : "opacity-0 -translate-y-2 max-h-0"}
        `}
                >
                    <Banner title="Updates">
                        {announcements.map(v => (
                            <div key={v.id} className="flex items-center gap-2">
                                <DotIcon />
                                <span>{v.text}</span>
                            </div>
                        ))}
                    </Banner>
                </div>
            </div>
            <Wars />
        </div>
    );
}
