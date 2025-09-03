import * as v from 'valibot';
import type { DataType } from '../../types/datatype';
import type { Ordering, QueryParameter } from './queryparameter';

export function sanatizeSingleQuoteInString(value: string) {
    return value.replaceAll("'", "’");
}

function indexToColumn(index: number): string {
    let col = '';
    index += 1; // 1-based
    while (index > 0) {
        const rem = (index - 1) % 26;
        col = String.fromCharCode(65 + rem) + col;
        index = Math.floor((index - 1) / 26);
    }
    return col;
}

function generateColumnLetters<T extends v.ObjectSchema<any, any>>(
    schema: T
): Record<keyof T['entries'], string> {
    const keys = Object.keys(schema.entries) as Array<keyof T['entries']>;
    const map: Record<keyof T['entries'], string> = {} as any;
    keys.forEach((k, i) => {
        map[k] = indexToColumn(i);
    });
    return map;
}

function formatValue(value: DataType): string {
    if (value === null) return 'NULL';
    if (typeof value === 'string') return `'${value.replace(/'/g, "''")}'`;
    if (typeof value === 'boolean') return value ? 'TRUE' : 'FALSE';
    return value.toString();
}

export function constructQuery<T extends v.ObjectSchema<any, any>>(
    schema: T,
    params?: QueryParameter<T>[],
    order?: Ordering<T>,
    limit?: number
): string {
    const columns = generateColumnLetters(schema);

    const where = params && params.length
        ? ' WHERE ' + params
            .map(p => `${columns[p.field]} ${p.operator} ${formatValue(p.value)}`)
            .join(' AND ')
        : '';

    const orderBy = order ? ` ORDER BY ${columns[order.column]} ${order.direction.toUpperCase()}` : '';
    const limitStr = limit ? ` LIMIT ${limit}` : '';

    const select = Object.keys(schema.entries)
        .map((_, i) => indexToColumn(i))
        .join(', ');

    return `SELECT ${select}${where}${orderBy}${limitStr}`;
}
