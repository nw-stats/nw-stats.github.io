import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { kWebsiteName } from "../../constants/name";
import { ArrowDownIcon, CircleHalfIcon, DiscordLogoIcon, RadioactiveIcon } from "@phosphor-icons/react";
import { useLocalStorage } from "../../hooks/useLocalStorage";

const Navbar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    const [isMoreOpen, setMoreOpen] = useState(false);
    const [isThemeOpen, setThemeOpen] = useState(false);

    const [theme, setTheme] = useLocalStorage<string>("theme", "dark");

    const toggleMenu = () => setIsOpen((v) => !v);

    // const toggleMore = () => setMoreOpen((v) => !v);
    // const toggleTheme = () => setThemeOpen((v) => !v);

    // Apply theme to <html>
    useEffect(() => {
        const root = document.documentElement;

        root.classList.remove("light", "dark", "retro");

        if (theme && theme !== "light") {
            root.classList.add(theme);
        }
    }, [theme]);

    return (
        <nav className="bg-background p-4 text-foreground w-full top-0 z-10 fixed shadow-md">
            <div className="container mx-auto flex justify-between items-center">

                {/* Logo */}
                <Link to="/">
                    <h2
                        className="text-xl font-bold text-title"
                        style={{ fontFamily: '"IM Fell English", serif' }}
                    >
                        {kWebsiteName}
                    </h2>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex space-x-4 items-center relative">

                    <NavLink to="/wars" className={({ isActive }) =>
                        isActive ? "px-3 py-2 bg-surface-active rounded" : "px-3 py-2 hover:bg-surface-hover rounded"
                    }>
                        Wars
                    </NavLink>

                    <NavLink to="/companies" className={({ isActive }) =>
                        isActive ? "px-3 py-2 bg-surface-active rounded" : "px-3 py-2 hover:bg-surface-hover rounded"
                    }>
                        Companies
                    </NavLink>

                    <NavLink to="/players" className={({ isActive }) =>
                        isActive ? "px-3 py-2 bg-surface-active rounded" : "px-3 py-2 hover:bg-surface-hover rounded"
                    }>
                        Players
                    </NavLink>

                    <NavLink to="/rankings" className={({ isActive }) =>
                        isActive ? "px-3 py-2 bg-surface-active rounded" : "px-3 py-2 hover:bg-surface-hover rounded"
                    }>
                        Company Rankings
                    </NavLink>

                    <NavLink
                        to="/character-rankings"
                        className={({ isActive }) =>
                            isActive ? "px-3 py-2 bg-surface-active rounded" : "px-3 py-2 hover:bg-surface-hover rounded"
                        }
                    >
                        <RadioactiveIcon size={24} />
                    </NavLink>

                    {/* 🎨 THEME DROPDOWN (NEW SEPARATE SECTION) */}
                    <div className="relative">
                        <button
                            className="px-3 py-2 hover:bg-surface-hover rounded"
                            onClick={() => {
                                setThemeOpen((v) => !v);
                                setMoreOpen(false);
                            }}
                        >
                            <CircleHalfIcon />
                        </button>

                        {isThemeOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-surface-1rounded shadow-lg z-20">

                                <button
                                    onClick={() => setTheme("light")}
                                    className="block w-full text-left px-4 py-2 hover:bg-surface-hover"
                                >
                                    Light
                                </button>

                                <button
                                    onClick={() => setTheme("dark")}
                                    className="block w-full text-left px-4 py-2 hover:bg-surface-hover"
                                >
                                    Dark
                                </button>

                                <button
                                    onClick={() => setTheme("retro")}
                                    className="block w-full text-left px-4 py-2 hover:bg-surface-hover"
                                >
                                    Retro
                                </button>
                            </div>
                        )}
                    </div>

                    {/* 📁 MORE DROPDOWN */}
                    <div className="relative">
                        <button
                            className="px-3 py-2 hover:bg-surface-hover rounded"
                            onClick={() => {
                                setMoreOpen((v) => !v);
                                setThemeOpen(false);
                            }}
                        >
                            <ArrowDownIcon />
                        </button>

                        {isMoreOpen && (
                            <div className="absolute right-0 mt-2 w-64 bg-surface-1rounded shadow-lg z-20">

                                <NavLink
                                    to="/orphans"
                                    className="block px-4 py-2 hover:bg-surface-hover"
                                    onClick={() => setMoreOpen(false)}
                                >
                                    Orphans
                                </NavLink>

                                <NavLink
                                    to="/groupless"
                                    className="block px-4 py-2 hover:bg-surface-hover"
                                    onClick={() => setMoreOpen(false)}
                                >
                                    Groupless
                                </NavLink>

                                <a
                                    href="https://discord.gg/jfhRyNSHvD"
                                    className="flex items-center gap-2 px-4 py-2 hover:bg-surface-hover"
                                >
                                    <DiscordLogoIcon size={12} />
                                    <span>Join the Discord</span>
                                </a>
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile Button */}
                <button
                    className="md:hidden text-foreground focus:outline-none"
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
            <div className={`md:hidden bg-background p-4 ${isOpen ? "block" : "hidden"}`}>

                <NavLink to="/wars" onClick={toggleMenu} className="block px-3 py-2 hover:bg-surface-hover rounded mb-2">
                    Wars
                </NavLink>

                <NavLink to="/companies" onClick={toggleMenu} className="block px-3 py-2 hover:bg-surface-hover rounded mb-2">
                    Companies
                </NavLink>

                <NavLink to="/players" onClick={toggleMenu} className="block px-3 py-2 hover:bg-surface-hover rounded mb-2">
                    Player Stats
                </NavLink>

                <NavLink to="/rankings" onClick={toggleMenu} className="block px-3 py-2 hover:bg-surface-hover rounded mb-2">
                    Company Rankings
                </NavLink>

                <NavLink to="/character-rankings" className="block px-3 py-2 hover:bg-surface-hover rounded mb-2">
                    <RadioactiveIcon size={24} />
                </NavLink>

                <a
                    href="https://discord.gg/jfhRyNSHvD"
                    className="flex items-center gap-2 px-4 py-2 hover:bg-surface-hover"
                >
                    <DiscordLogoIcon size={12} />
                    <span>Join the Discord</span>
                </a>

                {/* Mobile Theme */}
                <div className="mt-4 border-t border-gray-700 pt-2">
                    <div className="text-sm text-gray-400 px-2 mb-1"><CircleHalfIcon /></div>

                    <button onClick={() => setTheme("light")} className="block w-full text-left px-3 py-2 hover:bg-surface-hover">
                        Light
                    </button>

                    <button onClick={() => setTheme("dark")} className="block w-full text-left px-3 py-2 hover:bg-surface-hover">
                        Dark
                    </button>

                    <button onClick={() => setTheme("retro")} className="block w-full text-left px-3 py-2 hover:bg-surface-hover">
                        Retro
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
