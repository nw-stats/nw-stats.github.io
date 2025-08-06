import type { DataType } from "../services/googlesheets";
import type { Ordering, QueryParameter } from "../types/queryparameter";

type Operator = 'AND' | 'OR'

export function joinCondition(values: string[], operator: Operator, column: string): string {
    return values.map(val => `${column}='${val}'`).join(` ${operator} `);
}

export function sanitizeForGoogleSheetsQuery(value: DataType): string {
    if (typeof value === "string") {
        return `'${value}'`;
    } else if (value instanceof Date) {
        const year = value.getFullYear();
        const month = String(value.getMonth() + 1).padStart(2, "0"); // +1 because months are zero-based
        const day = String(value.getDate()).padStart(2, "0");
        return `DATE '${year}-${month}-${day}'`;
    } else {
        return `${value}`;
    }
}


export function makeConditions(params: QueryParameter[]): string {
    let conditions = new Map<string, string[]>();
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
    const conditions = params ? ` WHERE ${makeConditions(params)}` : '';
    const limitStr = limit ? ` LIMIT ${limit}` : '';
    const orderBy = order ? ` ORDER BY ${order.column} ${order.direction.toUpperCase()}` : '';
    const select = columns.map(v => v.toUpperCase()).join(', ');
    return `SELECT ${select}${conditions}${orderBy}${limitStr}`;
}
