import { getLeaderboard } from "../src/services/leaderboardservice";
import { getRosters } from "../src/services/rosterservice";
import { getWars } from "../src/services/wardbservice";
import { Qop } from "../src/types/queryparameter";
import { getGroupDetails } from '../src/utils/groups';

const warId = 21;
const lb = await getLeaderboard([{ column: "B", fn: Qop.Eq, value: warId }]);
const w = await getWars([{ column: "A", fn: Qop.Eq, value: warId }]);
const r = await getRosters([{ column: "B", fn: Qop.Eq, value: warId }]);
if (lb) {
    const gd = getGroupDetails(lb, r.get(warId)!);
    console.log(gd);
}
console.log(lb);
console.log(w);
console.log(r);
console.log('huh');
