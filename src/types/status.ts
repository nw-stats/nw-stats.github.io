export const validStatus = [
    'not started',
    'pending',
    'complete',
    'cancelled',
    'given',
] as const;

export type Status = (typeof validStatus)[number];
