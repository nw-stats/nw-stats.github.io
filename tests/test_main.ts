import { getAlts } from '../src/services/altservice';
import { getLeaderboardByCharacter } from

const alts = await getAlts('MAAJD');
const lb = await getLeader
console.log(alts);
