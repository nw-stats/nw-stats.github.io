export const validRegion = [
    'EU Central',
    'AP Southeast',
    'SA East',
    'US West',
    'US East',
    'unknown',
] as const;
export const validWorldSet = [
    'cross play',
    'playstation',
    'xbox',
    'unknown',
] as const;
export const validWorldKind = [
    'standard',
    'fresh',
    'seasonal',
    'unknown',
] as const;

export type Region = (typeof validRegion)[number];
export type WorldSet = (typeof validWorldSet)[number];
export type WorldKind = (typeof validWorldKind)[number];

export interface World {
    name: string;
    region: Region;
    worldset: WorldSet;
    kind: WorldKind;
}
