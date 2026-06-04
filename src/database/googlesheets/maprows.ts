import type { GvizType } from "./types";

export function mapRowsToObjects<T>(
    rows: GvizType[][],
    column: readonly (keyof T)[]
): Record<keyof T, GvizType>[] {
    return rows.map(row =>
        Object.fromEntries(
            column.map((col, i) => [col, row[i]])
        ) as Record<keyof T, GvizType>
    );
}
