import { getAlts, getPlayerNameFromAlt } from '../src/services/altservice';
import { getLeaderboard } from '../src/services/leaderboardservice';
import { Qop } from '../src/types/queryparameter';
import { getWars } from '../src/services/wardbservice';
import { getRosters } from '../src/services/rosterservice';
import { createPlayerDetailsAndSummary } from '../src/utils/player';
import { getPlayers } from '../src/services/playerservice';

const player = await getPlayerNameFromAlt('WideOppo') || 'WideOppo';
const alts = await getAlts(player);
const chars = await getPlayers(alts.map(v => ({ column: 'B', fn: Qop.Eq, value: v })));
const lbs = await getLeaderboard(alts.map(v => ({ column: 'C', fn: Qop.Eq, value: v })))
const warIds = lbs?.entries.map(v => v.warid);
const wars = await getWars(warIds?.map(v => ({ column: 'A', fn: Qop.Eq, value: v })));
const rosters = await getRosters(warIds!.map(v => ({ column: 'B', fn: Qop.Eq, value: v })));
const d = createPlayerDetailsAndSummary(chars, lbs!.entries, rosters, wars);
console.log(d);
