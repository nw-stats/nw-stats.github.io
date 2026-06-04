type ComparisonOperator = "=" | "<" | ">" | "<=" | ">=" | "<>" | 'IS' | 'IS NOT';
type JoinOperator = 'AND' | 'OR';

interface Condition<T, K extends keyof T> {
    type: 'condition';
    column: K;
    op: ComparisonOperator;
    value: T[K] | null;
}

interface Group<T> {
    type: 'group';
    op: JoinOperator;
    items: PredicateNode<T>[];
}

export type PredicateNode<T> = { [K in keyof T]: Condition<T, K> }[keyof T] | Group<T>;

export function createConditionOp<T, K extends keyof T>(
    column: K,
    op: ComparisonOperator,
    value: T[K] | null
): Condition<T, K> {
    return {
        type: 'condition',
        column,
        op,
        value,
    };
}


function flatten<T>(
    op: JoinOperator,
    items: PredicateNode<T>[]
): PredicateNode<T>[] {
    return items.flatMap(item => {
        if (item.type === 'group' && item.op === op) {
            return flatten(op, item.items);
        }
        return item;
    });
}
function createJoinOp<T>(
    op: JoinOperator,
    items: PredicateNode<T>[]
): Group<T> {
    if (items.length === 0) throw new Error(`'${op}' requires atleast one item`);
    const flattened = flatten(op, items);
    return {
        type: 'group',
        op,
        items: flattened,
    };
}

// Query builder helpers
export function eq<T, K extends keyof T>(
    column: K, value: T[K]): Condition<T, K> {
    return createConditionOp(column, '=', value);
}

export function gt<T, K extends keyof T>(
    column: K,
    value: T[K]
): Condition<T, K> {
    return createConditionOp(column, '>', value);
}

export function gte<T, K extends keyof T>(
    column: K,
    value: T[K]
): Condition<T, K> {
    return createConditionOp(column, '>=', value);
}

export function lt<T, K extends keyof T>(
    column: K,
    value: T[K]
): Condition<T, K> {
    return createConditionOp(column, '<', value);
}

export function lte<T, K extends keyof T>(
    column: K,
    value: T[K]
): Condition<T, K> {
    return createConditionOp(column, '<=', value);
}

export function neq<T, K extends keyof T>(
    column: K,
    value: T[K]
): Condition<T, K> {
    return createConditionOp(column, '<>', value);
}

export function isNull<T, K extends keyof T>(column: K): Condition<T, K> {
    return createConditionOp(column, 'IS', null);
}

export function isNotNull<T, K extends keyof T>(column: K): Condition<T, K> {
    return createConditionOp(column, 'IS NOT', null);
}

export function and<T>(
    ...items: PredicateNode<T>[]
): Group<T> {
    return createJoinOp('AND', items);
}

export function or<T>(
    ...items: PredicateNode<T>[]
): Group<T> {
    return createJoinOp('OR', items);
}
