import { FC, useEffect, useState } from "react";
import PendingMember from "../../components/groups/components/PendingMember";
import { inititalValues } from "../../utils/pagination";
import { useNavigate, useParams } from "react-router-dom";
import groupService from "../../services/groupService";
import { message } from "antd";
import LoadingIndicator from "../../components/LoadingIndicator";
import { GroupResource } from "../../types/group";
import { GroupInvitationResource } from "../../types/group-invitation";
import InviteMemberPending from "../../components/groups/components/InviteMemberPending";

const GroupPendingInvites: FC = () => {
    const { id } = useParams();
    const [group, setGroup] = useState<GroupResource>()
    const [pendingInvites, setPendingInvites] = useState<GroupInvitationResource[]>();
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState(inititalValues);

    const navigate = useNavigate()

    const fetchPendingInvites = async (page: number, size: number) => {
        if (id) {
            setLoading(true)
            const response = await groupService.getAllPendingInvitesByGroupId(id, page, size);
            setLoading(false)
            if (response.isSuccess) {
                setPendingInvites(response.data)
                setPagination(response.pagination)
            }
        }
    }

    const fetchGroup = async () => {
        if(id) {
            const response = await groupService.getGroupById(id);
            if(response.isSuccess) {
                setGroup(response.data);
            } else {
                navigate('/404')
            }
        }
        
    }

    useEffect(() => {
        if(group && !group?.onlyAdminCanApprovalMember) navigate('/404')
    }, [group])

    useEffect(() => {
        fetchGroup()
        fetchPendingInvites(pagination.page, pagination.size)
    }, [id])

    const handleRejectRequest = async (requestId: string) => {
        const response = await groupService.rejectRequestJoinGroup(requestId);
        if (response.isSuccess) {
            message.success(response.message)
            fetchPendingInvites(1, 6)
        } else {
            message.error(response.message)
        }
    }

    const handleApprovalRequest = async (requestId: string) => {
        const response = await groupService.approvalRequestJoinGroup(requestId);
        if (response.isSuccess) {
            message.success(response.message);
            fetchPendingInvites(1, 6)
        } else {
            message.error(response.message)
        }
    }

    return <div className="w-full px-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4 px-8">
            {pendingInvites?.map(request => <InviteMemberPending
                onApproval={() => handleApprovalRequest(request.id)}
                onReject={() => handleRejectRequest(request.id)}
                key={request.id}
                invitation={request}
            />)}
            
        </div>

        {loading && <LoadingIndicator />}
    </div>
};

export default GroupPendingInvites;
