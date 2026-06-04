import type { PredicateNode } from "./predicate";
import type { Sheet } from "./sheet";
import type { Ordering } from "./types";

function buildSelection<T>(sheet: Sheet<T, unknown>): string {
    const columns = Object.values(sheet.columns);
    return `SELECT ${columns.join(',')}`;
}
function escapeGvizString(value: string) {
    return value.replaceAll('"', '""');
}

function buildPredicate<T>(
    sheet: Sheet<T, unknown>,
    node: PredicateNode<T>
): string {
    if (node.type === 'condition') {
        const column = sheet.columns[node.column];
        const value = typeof node.value === 'string'
            ? `"${escapeGvizString(node.value)}"`
            : node.value;

        return `${column} ${node.op} ${value}`;
    }

    return '(' +
        node.items
            .map(v => buildPredicate(sheet, v))
            .join(` ${node.op} `)
        + ')';
}

function buildOrdering<T>(sheet: Sheet<T, unknown>, ordering: Ordering<T>): string {
    const column = sheet.columns[ordering.column];
    return `ORDER BY ${column} ${ordering.direction.toUpperCase()}`;
}

function buildLimit(limit: number): string {
    return `LIMIT ${limit}`;
}

export function buildQuery<T>(
    sheet: Sheet<T, unknown>,
    predicate?: PredicateNode<T>,
    ordering?: Ordering<T>,
    limit?: number
): string {
    if (Object.keys(sheet.columns).length === 0) {
        throw new Error('Selection cannot be empty.');
    }
    const parts: string[] = [];
    parts.push(buildSelection(sheet));
    if (predicate) parts.push(`WHERE ${buildPredicate(sheet, predicate)}`);
    if (ordering) parts.push(buildOrdering(sheet, ordering));
    if (limit !== undefined) parts.push(buildLimit(limit));

    return parts.join(' ');
}
