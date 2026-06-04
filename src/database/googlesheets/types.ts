export type GvizType = unknown;
export type OrderingOperator = 'asc' | 'desc';

type GvizCell = { v: GvizType };
export type GvizRow = { c: GvizCell[] };

export interface Ordering<T> {
    column: keyof T;
    direction: OrderingOperator;
}
