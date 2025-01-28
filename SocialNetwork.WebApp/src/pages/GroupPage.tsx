import { FC, useEffect, useState } from "react";
import GroupHeader from "../components/groups/GroupHeader";
import GroupRightSide from "../components/groups/GroupRightSide";
import GroupPostList from "../components/groups/GroupPostList";
import { useParams } from "react-router-dom";
import groupService from "../services/groupService";
import { GroupResource } from "../types/group";

const GroupPage: FC = () => {
    const { id } = useParams();
    const [group, setGroup] = useState<GroupResource>()

    const fetchGroup = async () => {
        if(id) {
            const response = await groupService.getGroupById(id);
            if(response.isSuccess) {
                setGroup(response.data)
            }
        }
    }

    useEffect(() => {
        fetchGroup()
    }, [id])

    return <div className="w-full flex flex-col gap-y-4 h-full bg-slate-100">
        {group && <GroupHeader group={group} />}
        <div className="flex flex-col h-full gap-y-4 lg:max-w-screen-lg md:max-w-screen-md max-w-screen-sm px-4 lg:px-0 mx-auto">
            <div className="grid grid-cols-12 gap-6 h-full">
                {id  && <GroupPostList groupId={id} />}
                {group && <GroupRightSide group={group} />}
            </div>
        </div >
    </div>
}

export default GroupPage;
