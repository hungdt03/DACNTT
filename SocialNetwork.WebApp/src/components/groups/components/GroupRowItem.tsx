import { FC } from "react";
import images from "../../../assets";
import { GroupResource } from "../../../types/group";
import { Link } from "react-router-dom";

type GroupRowItemProps = {
    group: GroupResource
}

const GroupRowItem: FC<GroupRowItemProps> = ({
    group
}) => {
    return <Link to={`/groups/${group.id}`} className="hover:text-black flex items-center gap-x-2 px-2 py-2 rounded-md hover:bg-gray-100">
        <img className="w-[45px] h-[45px] rounded-md border-[1px] border-gray-300 object-cover" src={group.coverImage ?? images.cover} />

        <div className="flex flex-col gap-y-1">
            <span className="text-[14px] font-semibold">{group.name}</span>
            <span className="text-xs text-gray-500">{group.description}</span>
        </div>
    </Link>
};

export default GroupRowItem;
