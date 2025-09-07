import type { GroupKey } from "../types/roster";

export function isNumberGroup(key: GroupKey): boolean {
    return typeof key === 'number'
}
