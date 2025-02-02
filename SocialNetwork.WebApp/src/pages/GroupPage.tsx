import { FC, useEffect, useState } from "react";
import GroupHeader from "../components/groups/GroupHeader";
import GroupRightSide from "../components/groups/GroupRightSide";
import GroupPostList from "../components/groups/GroupPostList";
import { useParams } from "react-router-dom";
import groupService from "../services/groupService";
import { GroupResource } from "../types/group";
import MyGroupManageSidebar from "../components/groups/components/MyGroupManageSidebar";
import cn from "../utils/cn";

const GroupPage: FC = () => {
    const { id, section } = useParams();
    const [group, setGroup] = useState<GroupResource>();

    const fetchGroup = async () => {
        if (id) {
            const response = await groupService.getGroupById(id);
            if (response.isSuccess) {
                setGroup(response.data)
            }
        }
    }

    useEffect(() => {
        fetchGroup()
    }, [id])

    return <div className="grid grid-cols-12 w-full h-full overflow-hidden">
        {group?.isMine && <MyGroupManageSidebar group={group} />}
        <div className={cn("w-full flex flex-col h-full bg-slate-100 overflow-y-auto", group?.isMine ? 'col-span-9' : 'col-span-12')}>
            {group && <GroupHeader group={group} />}
            {group?.isMember ? <div className="flex flex-col h-full gap-y-4 lg:max-w-screen-lg md:max-w-screen-md max-w-screen-sm px-4 lg:px-0 mx-auto">
                <div className="grid grid-cols-12 gap-6 overflow-y-auto">
                    {group && <GroupPostList group={group} />}
                    {group && <GroupRightSide group={group} />}
                </div>
            </div> : <div></div>}
        </div>
    </div>
}

export default GroupPage;
