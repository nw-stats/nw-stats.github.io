export type Region = 'EU Central' | 'AP Southeast' | 'SA East' | 'US West' | 'US East';
export type WorldSet = 'cross play' | 'playstation' | 'xbox';
export type WorldKind = 'standard' | 'fresh' | 'seasonal';

export interface World {
    id: number;
    name: string;
    region: Region;
    worldset: WorldSet;
    kind: WorldKind;
}
