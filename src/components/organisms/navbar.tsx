import { useEffect, useState, type JSX } from "react";
import { Link, NavLink } from "react-router-dom";
import { kWebsiteName } from "../../constants/name";
import {
    ArrowDownIcon,
    CircleHalfIcon,
    DiscordLogoIcon,
    RadioactiveIcon
} from "@phosphor-icons/react";
import { useLocalStorage } from "../../hooks/useLocalStorage";

const navItemBase =
    "px-3 py-2 rounded transition-colors duration-150";

const navItemInactive =
    `${navItemBase} bg-surface-1 hover:bg-surface-hover`;

const navItemActive =
    `${navItemBase} bg-surface-active`;

const dropdownItem =
    "block w-full text-left px-4 py-2 transition-colors duration-150 hover:bg-surface-hover";

export default function Navbar(): JSX.Element {
    const [isOpen, setIsOpen] = useState(false);

    const [isMoreOpen, setMoreOpen] = useState(false);
    const [isThemeOpen, setThemeOpen] = useState(false);

    const [theme, setTheme] = useLocalStorage<string>("theme", "dark");

    const toggleMenu = () => setIsOpen((v) => !v);

    useEffect(() => {
        const root = document.documentElement;

        root.classList.remove("light", "dark", "retro");

        if (theme && theme !== "light") {
            root.classList.add(theme);
        }
    }, [theme]);

    return (
        <nav className="bg-surface-1 border-b border-border text-foreground w-full top-0 z-10 fixed shadow-md">
            <div className="container mx-auto flex justify-between items-center p-4">

                {/* Logo */}
                <Link to="/">
                    <h2
                        className="text-xl font-bold text-title"
                        style={{ fontFamily: '"IM Fell English", serif' }}
                    >
                        {kWebsiteName}
                    </h2>
                </Link>

                {/* Desktop */}
                <div className="hidden md:flex items-center gap-2 relative">

                    <NavLink
                        to="/wars"
                        className={({ isActive }) =>
                            isActive ? navItemActive : navItemInactive
                        }
                    >
                        Wars
                    </NavLink>

                    <NavLink
                        to="/companies"
                        className={({ isActive }) =>
                            isActive ? navItemActive : navItemInactive
                        }
                    >
                        Companies
                    </NavLink>

                    <NavLink
                        to="/players"
                        className={({ isActive }) =>
                            isActive ? navItemActive : navItemInactive
                        }
                    >
                        Players
                    </NavLink>

                    <NavLink
                        to="/rankings"
                        className={({ isActive }) =>
                            isActive ? navItemActive : navItemInactive
                        }
                    >
                        Company Rankings
                    </NavLink>

                    <NavLink
                        to="/character-rankings"
                        className={({ isActive }) =>
                            isActive ? navItemActive : navItemInactive
                        }
                    >
                        <RadioactiveIcon size={20} />
                    </NavLink>

                    {/* Theme Dropdown */}
                    <div className="relative">
                        <button
                            className={navItemInactive}
                            onClick={() => {
                                setThemeOpen((v) => !v);
                                setMoreOpen(false);
                            }}
                        >
                            <CircleHalfIcon size={20} />
                        </button>

                        {isThemeOpen && (
                            <div className="absolute right-0 mt-2 w-48 overflow-hidden rounded-lg border border-border bg-surface-2 shadow-lg z-20">

                                <button
                                    onClick={() => setTheme("light")}
                                    className={dropdownItem}
                                >
                                    Light
                                </button>

                                <button
                                    onClick={() => setTheme("dark")}
                                    className={dropdownItem}
                                >
                                    Dark
                                </button>

                                <button
                                    onClick={() => setTheme("retro")}
                                    className={dropdownItem}
                                >
                                    Retro
                                </button>
                            </div>
                        )}
                    </div>

                    {/* More Dropdown */}
                    <div className="relative">
                        <button
                            className={navItemInactive}
                            onClick={() => {
                                setMoreOpen((v) => !v);
                                setThemeOpen(false);
                            }}
                        >
                            <ArrowDownIcon size={20} />
                        </button>

                        {isMoreOpen && (
                            <div className="absolute right-0 mt-2 w-64 overflow-hidden rounded-lg border border-border bg-surface-2 shadow-lg z-20">

                                <NavLink
                                    to="/orphans"
                                    className={dropdownItem}
                                    onClick={() => setMoreOpen(false)}
                                >
                                    Orphans
                                </NavLink>

                                <NavLink
                                    to="/groupless"
                                    className={dropdownItem}
                                    onClick={() => setMoreOpen(false)}
                                >
                                    Groupless
                                </NavLink>

                                <a
                                    href="https://discord.gg/jfhRyNSHvD"
                                    className="flex items-center gap-2 px-4 py-2 transition-colors duration-150 hover:bg-surface-hover"
                                >
                                    <DiscordLogoIcon size={14} />
                                    <span>Join the Discord</span>
                                </a>
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile Button */}
                <button
                    className="md:hidden text-foreground"
                    onClick={toggleMenu}
                >
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 6h16M4 12h16m-7 6h7"
                        />
                    </svg>
                </button>
            </div>

            {/* Mobile Menu */}
            <div
                className={`md:hidden border-t border-border bg-background p-4 space-y-2 ${isOpen ? "block" : "hidden"
                    }`}
            >
                <NavLink
                    to="/wars"
                    onClick={toggleMenu}
                    className={({ isActive }) =>
                        `block ${isActive ? navItemActive : navItemInactive}`
                    }
                >
                    Wars
                </NavLink>

                <NavLink
                    to="/companies"
                    onClick={toggleMenu}
                    className={({ isActive }) =>
                        `block ${isActive ? navItemActive : navItemInactive}`
                    }
                >
                    Companies
                </NavLink>

                <NavLink
                    to="/players"
                    onClick={toggleMenu}
                    className={({ isActive }) =>
                        `block ${isActive ? navItemActive : navItemInactive}`
                    }
                >
                    Players
                </NavLink>

                <NavLink
                    to="/rankings"
                    onClick={toggleMenu}
                    className={({ isActive }) =>
                        `block ${isActive ? navItemActive : navItemInactive}`
                    }
                >
                    Company Rankings
                </NavLink>

                <NavLink
                    to="/character-rankings"
                    onClick={toggleMenu}
                    className={({ isActive }) =>
                        `block ${isActive ? navItemActive : navItemInactive}`
                    }
                >
                    <RadioactiveIcon size={20} />
                </NavLink>

                <a
                    href="https://discord.gg/jfhRyNSHvD"
                    className="flex items-center gap-2 rounded px-4 py-2 bg-surface-1 hover:bg-surface-hover transition-colors duration-150"
                >
                    <DiscordLogoIcon size={14} />
                    <span>Join the Discord</span>
                </a>

                {/* Mobile Theme Section */}
                <div className="mt-4 rounded-lg border border-border bg-surface-1 p-2">
                    <div className="px-2 py-1 text-muted">
                        <CircleHalfIcon size={18} />
                    </div>

                    <button
                        onClick={() => setTheme("light")}
                        className={dropdownItem}
                    >
                        Light
                    </button>

                    <button
                        onClick={() => setTheme("dark")}
                        className={dropdownItem}
                    >
                        Dark
                    </button>

                    <button
                        onClick={() => setTheme("retro")}
                        className={dropdownItem}
                    >
                        Retro
                    </button>
                </div>
            </div>
        </nav>
    );
};
