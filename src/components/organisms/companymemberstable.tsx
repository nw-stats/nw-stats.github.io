import type { JSX } from "react";
import type { Character } from "../../types/character";

import PlayerListCard from "../atom/playerlistcard";
import { NoData } from "../atom/nodata";

interface CompanyMemberProps {
    members: Character[];
}
function CompanyMembersTable({ members }: CompanyMemberProps): JSX.Element {
    // const columns = useMemo<ColumnDef<Player>[]>(() => [
    //     {
    //         accessorKey: 'name',
    //         header: 'Name',
    //         cell: info => info.getValue(),
    //     },
    //     {
    //         accessorKey: 'role',
    //         header: 'Role',
    //         cell: info => info.getValue(),
    //     },
    // ], []);

    return (
        <div className="flex flex-col w-full gap-2">
            {members.length > 0 ?
                members.map(v => <div className="hover:scale-105"><PlayerListCard player={v} /></div>) :
                <NoData />}
        </div>
        // <StatsTable columns={columns} data={members} />
    );
}
export default CompanyMembersTable;
;
