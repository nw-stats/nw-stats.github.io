import type { GroupKey } from "../types/roster";

export function isQpdsGroup(key: GroupKey) {
    return typeof key === 'string';
}
