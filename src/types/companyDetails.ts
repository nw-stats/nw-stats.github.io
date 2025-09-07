import type { Character } from "./character";
import type { Company } from "./company";
import type { War } from "./war";

export interface CompanyDetails {
    company: Company;
    wars: War[];
    members: Character[];
}
