import type { ColumnDef } from "@tanstack/react-table";

export function calculateColumnSums<T>(data: T[], numericKeys: (keyof T)[]): Record<string, number> {
    const sums = {} as Record<string, number>;
    for (const key of numericKeys) {
        sums[key as string] = data.reduce((acc, row) => acc + (row[key] as unknown as number ?? 0), 0);
    }
    return sums;
}

export function calculateColumnAverage<T>(data: T[], numericKeys: (keyof T)[]): Record<string, number> {
    const sums = calculateColumnSums(data, numericKeys);
    const averages: Record<string, number> = {};

    for (const key of numericKeys) {
        averages[key as string] = data.length > 0 ? sums[key as string] / data.length : 0;
    }

    return averages;
}


function isAccessorKeyColumn<T>(col: ColumnDef<T>): col is ColumnDef<T> & { accessorKey: string } {
    return typeof (col as any).accessorKey === 'string';
}

export function getColumnById<T>(columns: ColumnDef<T>[], id: string): ColumnDef<T> | undefined {
    return columns.find(col => {
        if (isAccessorKeyColumn(col)) {
            return col.accessorKey === id;
        }
        return (col as any).id === id;
    });
}
