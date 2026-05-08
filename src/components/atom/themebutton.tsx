import { useEffect } from "react";
import { useLocalStorage } from "../../hooks/useLocalStorage";

export default function ThemeButton() {
    const [theme, setTheme] = useLocalStorage<string>("theme", "dark");

    useEffect(() => {
        const root = document.documentElement;
        root.classList.remove("dark", "retro");
        if (theme) {
            root.classList.add(theme);
        }
    }, [theme]);

    return (
        <div className="flex gap-2">
            <button onClick={() => setTheme("light")}>Light</button>
            <button onClick={() => setTheme("dark")}>Dark</button>
            <button onClick={() => setTheme("retro")}>Retro</button>
        </div>
    );
}
