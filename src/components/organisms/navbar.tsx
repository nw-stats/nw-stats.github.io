import { useEffect, useState, type JSX, type ReactNode } from "react";
import { Link, NavLink } from "react-router-dom";
import {
    CaretDownIcon,
    CircleHalfIcon,
    DiscordLogoIcon,
    ListIcon,
    RadioactiveIcon
} from "@phosphor-icons/react";

import { useLocalStorage } from "../../hooks/useLocalStorage";
import { kWebsiteName } from "../../constants/name";
import Dropdown from "../atom/dropdown";
import type { Season } from "../../constants/sheets";
import { useSeason } from "../../hooks/base/useSeason";


type NavItem = {
    label: string;
    to: string;
    icon?: ReactNode;
}
const navItemBase =
    "px-3 py-2 rounded-md transition-colors";

const navItemInactive =
    `${navItemBase} hover:bg-surface-hover`;

const navItemActive =
    `${navItemBase} bg-surface-active`;

const dropdownItem =
    "flex items-center gap-2 w-full px-4 py-2 hover:bg-surface-hover";

const primaryLinks: NavItem[] = [
    { label: "Wars", to: "/wars" },
    { label: "Companies", to: "/companies" },
    { label: "Players", to: "/players" },
    { label: "Rankings", to: "/rankings" },
];

const toolLinks: NavItem[] = [
    {
        label: "Player Compare",
        to: "/players-compare"
    },
    {
        label: "Character Rankings",
        to: "/character-rankings",
        icon: <RadioactiveIcon size={16} />
    },
    {
        label: "Orphans",
        to: "/orphans"
    },
    {
        label: "Groupless",
        to: "/groupless"
    }
];

export default function Navbar(): JSX.Element {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [toolsOpen, setToolsOpen] = useState(false);
    const [themeOpen, setThemeOpen] = useState(false);

    const { season, setSeason } = useSeason();

    const [theme, setTheme] =
        useLocalStorage("theme", "dark");

    useEffect(() => {
        const root = document.documentElement;

        root.classList.remove(
            "light",
            "dark",
            "retro"
        );

        if (theme !== "light") {
            root.classList.add(theme);
        }
    }, [theme]);

    return (
        <nav className="fixed top-0 z-50 w-full border-b border-border bg-surface-1 shadow-md">

            <div className="container mx-auto flex h-16 items-center justify-between px-4">

                {/* Left */}

                <div className="flex items-center gap-8">

                    <Link
                        to="/"
                        className="font-bold text-xl text-title"
                        style={{
                            fontFamily:
                                '"IM Fell English", serif'
                        }}
                    >
                        {kWebsiteName}
                    </Link>

                    {/* Desktop Nav */}

                    <div className="hidden md:flex items-center gap-1">

                        {primaryLinks.map(link => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                className={({ isActive }) =>
                                    isActive
                                        ? navItemActive
                                        : navItemInactive
                                }
                            >
                                {link.label}
                            </NavLink>
                        ))}

                        <div className="relative">

                            <button
                                className={navItemInactive}
                                onClick={() => {
                                    setToolsOpen(v => !v);
                                    setThemeOpen(false);
                                }}
                            >
                                <span className="flex items-center gap-1">
                                    Tools
                                    <CaretDownIcon size={14} />
                                </span>
                            </button>

                            {toolsOpen && (
                                <div className="absolute mt-2 w-56 rounded-lg border border-border bg-surface-2 overflow-hidden shadow-lg">

                                    {toolLinks.map(item => (
                                        <NavLink
                                            key={item.to}
                                            to={item.to}
                                            className={dropdownItem}
                                            onClick={() => setToolsOpen(false)}
                                        >
                                            {item.icon}
                                            {item.label}
                                        </NavLink>
                                    ))}

                                </div>
                            )}
                        </div>

                    </div>

                </div>

                {/* Right */}

                <div className="hidden md:flex items-center gap-2">

                    <Dropdown
                        options={["Season10", "Season9"]}
                        value={season}
                        onChange={(v) => {
                            setSeason(v as Season);
                            // window.location.reload();
                        }} />
                    <a
                        href="https://discord.gg/jfhRyNSHvD"
                        className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-surface-hover"
                    >
                        <DiscordLogoIcon size={18} weight="fill" />
                    </a>
                    <div className="relative">
                        <button
                            className="p-2 rounded-md hover:bg-surface-hover"
                            onClick={() => {
                                setThemeOpen(v => !v);
                                setToolsOpen(false);
                            }}
                        >
                            <CircleHalfIcon size={18} />
                        </button>

                        {themeOpen && (
                            <div className="absolute right-0 mt-2 w-40 rounded-lg border border-border bg-surface-2 overflow-hidden shadow-lg">

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

                </div>

                {/* Mobile */}

                <button
                    className="md:hidden"
                    onClick={() =>
                        setMobileOpen(v => !v)
                    }
                >
                    <ListIcon size={24} />
                </button>

            </div>

            {mobileOpen && (
                <div className="md:hidden border-t border-border bg-background p-4 space-y-4">

                    <div>
                        <div className="mb-2 text-sm font-medium text-muted">
                            Season
                        </div>

                        <Dropdown
                            options={["Season10", "Season9"]}
                            value={season}
                            onChange={(v) => {
                                setSeason(v as Season);
                            }}
                        />
                    </div>

                    <div className="space-y-2">
                        {[...primaryLinks, ...toolLinks].map(link => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                onClick={() => setMobileOpen(false)}
                                className={({ isActive }) =>
                                    `block ${isActive
                                        ? navItemActive
                                        : navItemInactive
                                    }`
                                }
                            >
                                <div className="flex items-center gap-2">
                                    {link.icon}
                                    {link.label}
                                </div>
                            </NavLink>
                        ))}
                    </div>

                </div>
            )}
        </nav>
    );
}
