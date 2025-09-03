import * as v from "valibot";

export const WorldSchema = v.object({
    name: v.string(),
    region: v.string(),
    worldSet: v.string(),
    kind: v.string(),
});

export type WorldRow = v.InferOutput<typeof WorldSchema>;
