import { useMemo, useState } from "react";

type Props = {
    items: string[];
    value?: string;
    onSelect?: (value: string) => void;
};

export default function SearchBox({
    items,
    value,
    onSelect
}: Props) {
    const [query, setQuery] = useState(value ?? "");
    const [open, setOpen] = useState(false);

    const filtered = useMemo(() => {
        const q = query.toLowerCase().trim();

        if (!q) return items.slice(0, 8);

        return items
            .filter(item => item.toLowerCase().includes(q))
            .slice(0, 8);
    }, [query, items]);

    return (
        <div className="relative w-full max-w-md">
            <input
                value={query}
                onChange={(e) => {
                    setQuery(e.target.value);
                    setOpen(true);
                }}
                onFocus={() => setOpen(true)}
                onBlur={() => setTimeout(() => setOpen(false), 100)}
                placeholder="Search..."
                className="
                    w-full
                    rounded-xl
                    border border-border
                    bg-surface-1
                    px-3 py-2
                    text-foreground
                    outline-none
                    focus:ring-2 focus:ring-ring
                "
            />

            {open && filtered.length > 0 && (
                <div
                    className="
                        absolute z-10 mt-2 w-full
                        rounded-xl
                        border border-border
                        bg-surface-1
                        shadow-lg
                        overflow-hidden
                    "
                >
                    {filtered.map(item => (
                        <button
                            key={item}
                            onMouseDown={() => {
                                setQuery(item);
                                setOpen(false);
                                onSelect?.(item);
                            }}
                            className="
                                w-full
                                px-3 py-2
                                text-left
                                hover:bg-surface-hover
                                transition
                            "
                        >
                            {item}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
