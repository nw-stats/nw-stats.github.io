import * as v from 'valibot';
import type { DataType } from '../../types/datatype';

export type OrderingOperator = "asc" | "desc";

export type QueryOperator = "=" | "<" | ">" | "<=" | ">=" | "<>" | 'IS NOT';
export const Qop: Record<string, QueryOperator> = {
    Eq: '=',
    Neq: '<>',
    Lt: '<',
    Lte: '<=',
    Gt: '>',
    Gte: '>=',
    Not: 'IS NOT',
}
export interface Ordering<T extends v.ObjectSchema<any, any>> {
    column: keyof T['entries'];
    direction: OrderingOperator;
}
export interface QueryParameter<T extends v.ObjectSchema<any, any>> {
    field: keyof T['entries'];
    operator: QueryOperator;
    value: DataType;
}
