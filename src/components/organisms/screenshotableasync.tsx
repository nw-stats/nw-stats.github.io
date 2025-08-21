// This is too slow


import { useEffect, useRef, useState, type JSX } from "react";
import { toPng } from "html-to-image";

interface ScreenShotableProps {
    button: React.RefObject<HTMLButtonElement | null>;
    children: React.ReactNode;
}

export function ScreenShotableAsync({ button, children }: ScreenShotableProps): JSX.Element {
    const [loading, setLoading] = useState(false);
    const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
    const screenshotRef = useRef<HTMLDivElement>(null);

    // Function to generate screenshot
    const generateScreenshot = async () => {
        if (!screenshotRef.current) return;
        try {
            setLoading(true);
            const dataUrl = await toPng(screenshotRef.current, {
                backgroundColor: "#101828",
                cacheBust: true,
                skipFonts: true,
            });
            setImageDataUrl(dataUrl);
        } catch (err) {
            console.error("Failed to pre-generate image", err);
        } finally {
            setLoading(false);
        }
    };

    // Pre-generate on mount
    useEffect(() => {
        void generateScreenshot();
    }, []);

    // Wire up external button
    useEffect(() => {
        if (!button?.current) return;
        const handleDownload = () => {
            if (!imageDataUrl) return;
            const link = document.createElement("a");
            link.download = "leaderboard.png";
            link.href = imageDataUrl;
            link.click();
        };
        button.current.addEventListener("click", handleDownload);
        return () => {
            button.current?.removeEventListener("click", handleDownload);
        };
    }, [button, imageDataUrl]);

    // Disable button while loading
    useEffect(() => {
        if (button?.current) {
            button.current.disabled = loading || !imageDataUrl;
        }
    }, [button, loading, imageDataUrl]);

    // MutationObserver to detect internal state changes in children
    useEffect(() => {
        if (!screenshotRef.current) return;

        let timeout: NodeJS.Timeout;

        const observer = new MutationObserver(() => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                void generateScreenshot();
            }, 1000); // wait 200ms after last change
        });

        observer.observe(screenshotRef.current, {
            subtree: true,
            childList: true,
            characterData: true,
        });

        return () => {
            clearTimeout(timeout);
            observer.disconnect();
        };
    }, []);

    return <div ref={screenshotRef}>{children}</div>;
}
