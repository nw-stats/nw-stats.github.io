import * as v from 'valibot';

export const NumberOrDashSchema = v.pipe(
    v.nullable(v.union([v.string(), v.number()])), // accept numbers or strings or null
    v.transform((input) => {
        if (input === null) return null;
        if (typeof input === "string") {
            if (input.trim() === "-" || input.trim() === "") return undefined;
            const parsed = Number(input);
            return isNaN(parsed) ? undefined : parsed;
        }
        return input; // already a number
    })
);
