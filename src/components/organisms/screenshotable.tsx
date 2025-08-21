import { useEffect, useRef, useState, type JSX } from "react";
import { toPng } from "html-to-image";

interface ScreenShotableProps {
    /** External button element (e.g. passed with a ref) */
    button: HTMLButtonElement | null;
    children: React.ReactNode;
}

export function ScreenShotable({ button, children }: ScreenShotableProps): JSX.Element {
    const [loading, setLoading] = useState(false);
    const screenshotRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!button) return;

        const handleClick = async () => {
            if (!screenshotRef.current) return;
            try {
                setLoading(true);
                const dataUrl = await toPng(screenshotRef.current, {
                    backgroundColor: "#101828",
                    cacheBust: true,
                    skipFonts: true,
                });
                const link = document.createElement("a");
                link.download = "screenshot.png";
                link.href = dataUrl;
                link.click();
            } finally {
                setLoading(false);
            }
        };

        button.addEventListener("click", handleClick);
        return () => button.removeEventListener("click", handleClick);
    }, [button, children]);



    useEffect(() => {
        if (button) {
            button.disabled = loading;
        }
    }, [button, loading]);

    return (
        <div ref={screenshotRef}>
            {children}
        </div>
    );
}
