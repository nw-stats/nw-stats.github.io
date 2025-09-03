import * as v from 'valibot';
import { NumberOrDashSchema } from './fields/numberordash';

// Define the WarSchema
export const WarSchema = v.object({
    id: v.number(),
    date: v.string(),
    time: v.string(),
    server: v.string(),
    territory: v.string(),
    attacker: v.string(),
    defender: v.string(),
    winner: v.nullable(v.string()),
    pointA: NumberOrDashSchema,
    pointB: NumberOrDashSchema,
    pointC: NumberOrDashSchema,
    fort: NumberOrDashSchema,
    duration: v.nullable(v.number()),
    show: v.boolean(),
    status: v.nullable(v.string()),
    tz: v.string(),
    hideRoles: v.boolean(),
});

export type WarRow = v.InferOutput<typeof WarSchema>;
