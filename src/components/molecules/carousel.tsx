import { useEffect, useState } from "react";
import type { JSX } from "react";

interface CarouselProps {
    items: JSX.Element[];
    delay: number; // milliseconds
}

function Carousel({ items, delay }: CarouselProps): JSX.Element {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (items.length <= 1) return;

        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % items.length);
        }, delay);

        return () => clearInterval(interval);
    }, [items, delay]);

    return (
        <div className="relative w-full h-64 overflow-hidden">
            {items.map((item, i) => (
                <div
                    key={i}
                    className={`absolute inset-0 transition-opacity duration-500 ${i === index ? "opacity-100" : "opacity-0"
                        }`}
                >
                    {item}
                </div>
            ))}
        </div>
    );
}

export default Carousel;
