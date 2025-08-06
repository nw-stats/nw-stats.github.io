import React from "react";

interface DropdownProps {
    options: string[];
    value: string;
    onChange: (value: string) => void;
}

function Dropdown({ options, value, onChange }: DropdownProps): React.JSX.Element {
    return (
        <div className="relative inline-block w-64">
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="block w-full appearance-none bg-gray-700 border border-gray-600 text-white py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                {options.map(option => (
                    <option key={option} value={option}>{option}</option>
                ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
                <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                >
                    <path d="M5.516 7.548a.625.625 0 0 1 .884-.884L10 10.264l3.6-3.6a.625.625 0 1 1 .884.884l-4.042 4.042a.625.625 0 0 1-.884 0L5.516 7.548z" />
                </svg>
            </div>
        </div>
    );
}

export default Dropdown;
