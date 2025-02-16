import { FC, useEffect, useState } from "react";
import GroupRightSide from "../../components/groups/GroupRightSide";
import GroupPostList from "../../components/groups/GroupPostList";
import { useParams } from "react-router-dom";
import groupService from "../../services/groupService";
import { GroupResource } from "../../types/group";
import { GroupPrivacy } from "../../enums/group-privacy";
import GroupPending from "../../components/groups/components/GroupPending";

const GroupHomePage: FC = () => {
    const { id } = useParams();
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
        fetchGroup();
    }, [id])

    return <div className="flex flex-col w-full h-full gap-y-4 lg:max-w-screen-lg md:max-w-screen-md max-w-screen-sm px-2 md:px-4 lg:px-0 mx-auto">
        {group?.isMember || group?.privacy === GroupPrivacy.PUBLIC ? <div className="grid grid-cols-12 gap-6 overflow-y-hidden h-full w-full">
            {group && <GroupPostList onFetchGroup={fetchGroup} group={group} />}
            {group && <GroupRightSide group={group} />}
        </div> : group && <GroupPending group={group} />}
    </div>
}

export default GroupHomePage;
