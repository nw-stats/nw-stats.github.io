import type { JSX } from "react";

interface CheckboxProps {
    checked: boolean;
    onChecked: (checked: boolean) => void;
    label?: string;
}

export function Checkbox({ checked, onChecked, label = "Enable feature" }: CheckboxProps): JSX.Element {
    return (
        <label className="flex items-center gap-2 cursor-pointer">
            <input
                type="checkbox"
                checked={checked}
                onChange={(e) => onChecked(e.target.checked)}
                className="w-4 h-4 accent-blue-600 rounded border-gray-300 focus:ring-2 focus:ring-blue-500" />
            <span>{label}</span>
        </label>
    );
}
