import { FC, useEffect, useState } from "react";
import GroupMemberLeftSide from "../../components/groups/components/GroupMemberLeftSide";
import GroupMemberRightSide from "../../components/groups/components/GroupMemberRightSide";
import { useNavigate, useParams } from "react-router-dom";
import { GroupResource } from "../../types/group";
import groupService from "../../services/groupService";
import { GroupMemberResource } from "../../types/group-member";
import LoadingIndicator from "../../components/LoadingIndicator";

const GroupMemberDetailPage: FC = () => {
    const { id, userId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false)

    const [group, setGroup] = useState<GroupResource>();
    const [groupMember, setGroupMember] = useState<GroupMemberResource>();

    const fetchGroupMember = async () => {
        if (id && userId) {
            const response = await groupService.getGroupMemberByGroupIdAndUserId(id, userId);
            if (response.isSuccess) {
                setGroupMember(response.data)
            } else {
                navigate('/404')
            }
        }
    }

    const fetchGroup = async () => {
        if (id) {
            const response = await groupService.getGroupById(id);
            if (response.isSuccess) {
                setGroup(response.data)
            } else {
                navigate('/404')
            }
        }
    }

    const fetchAll = async () => {
        setLoading(true)
        await Promise.all([fetchGroup(), fetchGroupMember()])
        setLoading(false)
    }

    useEffect(() => {
        fetchAll()
    }, [id])

    return <div className="lg:max-w-screen-lg md:max-w-screen-md max-w-screen-sm mx-auto p-2 lg:px-0 lg:py-4 w-full h-full">
        {loading && <LoadingIndicator />}
        <div className="w-full h-full flex flex-col lg:grid grid-cols-12 gap-2 lg:gap-4">
            {groupMember && group && <GroupMemberLeftSide group={group} member={groupMember} />}
            {groupMember && group && <GroupMemberRightSide group={group} member={groupMember} />}
        </div>
    </div>
};

export default GroupMemberDetailPage;
