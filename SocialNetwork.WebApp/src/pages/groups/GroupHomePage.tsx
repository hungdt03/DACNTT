import { FC, useEffect, useState } from "react";
import GroupHeader from "../../components/groups/GroupHeader";
import GroupRightSide from "../../components/groups/GroupRightSide";
import GroupPostList from "../../components/groups/GroupPostList";
import { useParams } from "react-router-dom";
import groupService from "../../services/groupService";
import { GroupResource } from "../../types/group";
import { JoinGroupRequestResource } from "../../types/join-group";
import { GroupPrivacy } from "../../enums/group-privacy";
import GroupPending from "../../components/groups/components/GroupPending";

const GroupHomePage: FC = () => {
    const { id } = useParams();
    const [group, setGroup] = useState<GroupResource>();
    const [requestJoin, setRequestJoin] = useState<JoinGroupRequestResource>()

    const fetchGroup = async () => {
        if (id) {
            const response = await groupService.getGroupById(id);
            if (response.isSuccess) {
                setGroup(response.data)
            }
        }
    }

    const fetchRequestJoin = async () => {
        if (id) {
            const response = await groupService.getJoinGroupRequestByGroupId(id);
            if (response.isSuccess) {
                setRequestJoin(response.data)
            }
        }
    }

    useEffect(() => {
        fetchGroup();
        fetchRequestJoin()
    }, [id])

    return <>
        {group && <GroupHeader onFetch={fetchGroup} requestJoin={requestJoin} group={group} />}
        <div className="flex flex-col h-full gap-y-4 lg:max-w-screen-lg md:max-w-screen-md max-w-screen-sm px-4 lg:px-0 mx-auto">
            {group?.isMember || group?.privacy === GroupPrivacy.PUBLIC ? <div className="grid grid-cols-12 gap-6 overflow-y-auto">
                {group && <GroupPostList group={group} />}
                {group && <GroupRightSide group={group} />}
            </div> : group && <GroupPending group={group} />}
        </div>
    </>
}

export default GroupHomePage;
