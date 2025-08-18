import { CaretDownIcon, CheckIcon } from "@phosphor-icons/react";
import { useEffect, useRef, useState, type JSX } from "react";

interface MultiselectDropdownProps {
    name: string;
    options: string[];
    value: string[];
    onChange: (value: string[]) => void;
}

export function MultiselectDropdown({
    name,
    options,
    value,
    onChange,
}: MultiselectDropdownProps): JSX.Element {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState(""); // State for search input
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Filter options based on search query
    const filteredOptions = options.filter((option) =>
        option.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const toggleOption = (option: string) => {
        if (value.includes(option)) {
            onChange(value.filter((v) => v !== option));
        } else {
            onChange([...value, option]);
        }
    };

    const toggleAll = () => {
        if (value.length === options.length) {
            // All selected → clear
            onChange([]);
        } else {
            // Not all selected → select all (only filtered options if search is active)
            onChange(searchQuery ? [...value, ...filteredOptions.filter((opt) => !value.includes(opt))] : [...options]);
        }
    };

    const allSelected = value.length === options.length && options.length > 0;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setSearchQuery(""); // Clear search when closing
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div ref={dropdownRef} className="relative inline-block w-full text-white">
            {/* Dropdown button */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between bg-gray-700 text-white px-3 py-2 rounded-lg"
            >
                <span className="truncate overflow-hidden text-ellipsis whitespace-nowrap">
                    {allSelected
                        ? `All ${name}`
                        : value.length > 0
                            ? value.join(", ")
                            : `Select ${name}`}
                </span>
                <CaretDownIcon
                    size={18}
                    weight="bold"
                    className={`ml-2 transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
            </button>

            {/* Dropdown menu */}
            {isOpen && (
                <div className="absolute mt-2 w-full bg-gray-800 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                    {/* Search bar */}
                    <div className="sticky top-0 bg-gray-800 p-2 border-b border-gray-700">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search options..."
                            className="w-full bg-gray-900 text-white px-3 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-400 placeholder-gray-400"
                        />
                    </div>

                    {/* "All" option */}
                    <button
                        type="button"
                        onClick={toggleAll}
                        className={`flex items-center justify-between w-full px-3 py-2 text-left hover:bg-gray-700 ${allSelected ? "font-semibold text-rose-400" : "text-gray-200"
                            }`}
                    >
                        <span>All</span>
                        {allSelected && <CheckIcon size={16} weight="bold" />}
                    </button>

                    {/* Filtered options */}
                    {filteredOptions.length === 0 ? (
                        <div className="px-3 py-2 text-gray-400">No options found</div>
                    ) : (
                        filteredOptions.map((option, index) => {
                            const selected = value.includes(option);
                            return (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={() => toggleOption(option)}
                                    className={`flex items-center justify-between w-full px-3 py-2 text-left hover:bg-gray-700 ${selected ? "font-semibold text-rose-400" : "text-gray-200"
                                        }`}
                                >
                                    <span>{option}</span>
                                    {selected && <CheckIcon size={16} weight="bold" />}
                                </button>
                            );
                        })
                    )}
                </div>
            )}
        </div>
    );
}
