import { DateTime } from "luxon";
import type { DataType } from "../services/googlesheets";
import type { Ordering, QueryParameter } from "../types/queryparameter";

type Operator = 'AND' | 'OR'

export function joinCondition(values: string[], operator: Operator, column: string): string {
    return values.map(val => `${column}='${val}'`).join(` ${operator} `);
}

export function sanitizeForGoogleSheetsQuery(value: DataType): string {
    if (typeof value === "string") {
        return `'${sanatizeSingleQuoteInString(value)}'`;
    } else if (value instanceof DateTime) {
        const now = value.toFormat("yyyy-MM-dd");
        return `DATE '${now}'`;
    } else {
        return `${value}`;
    }
}


export function makeConditions(params: QueryParameter[]): string {
    const conditions = new Map<string, string[]>();
    for (const q of params) {
        let c = conditions.get(q.column);
        if (!c) {
            c = []
            conditions.set(q.column, c);
        }
        c.push(`(${q.column} ${q.fn} ${sanitizeForGoogleSheetsQuery(q.value)})`);
    }

    const columnCondtions = []
    for (const [_, cond] of conditions) {
        columnCondtions.push(`(${cond.join(' OR ')})`);
    }

    return columnCondtions.join(' AND ');
}

export function constructQuery(columns: string[], params?: QueryParameter[], order?: Ordering, limit?: number): string {
    if (limit && limit <= 0) {
        throw new Error(`Limit must be greater than 0. limit=${limit}`);
    }
    const conditions = params && params.length > 0 ? ` WHERE ${makeConditions(params)}` : '';
    const limitStr = limit ? ` LIMIT ${limit}` : '';
    const orderBy = order ? ` ORDER BY ${order.column} ${order.direction.toUpperCase()}` : '';
    const select = columns.sort().map(v => v.toUpperCase()).join(', ');
    return `SELECT ${select}${conditions}${orderBy}${limitStr}`;
}

export function sanatizeSingleQuoteInString(value: string) {
    return value.replaceAll("'", "''");
}
