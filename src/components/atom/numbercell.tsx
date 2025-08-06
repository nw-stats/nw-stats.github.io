import type React from "react";
import { formatCompact, formatThousands } from "../../utils/format";
import { useMediaQuery } from "react-responsive";

export type DisplayType = 'number' | 'percent' | 'exponential' | 'engineering' | 'fixed';

export interface NumberCellPro {
    value: number;
    className?: string
    display?: DisplayType
    figures?: number
}

const NumberCell: React.FC<NumberCellPro> = ({ value, className, display, figures }) => {
    const isSmall = useMediaQuery({ maxWidth: 768 })
    return (<span className={className}>{isSmall ? formatCompact(value) : formatThousands(value, figures)}{display === "percent" && "%"}</span>);
};
export default NumberCell
