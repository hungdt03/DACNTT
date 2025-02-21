import { FC, useEffect, useState } from "react";
import { inititalValues } from "../../utils/pagination";
import { useNavigate, useParams } from "react-router-dom";
import groupService from "../../services/groupService";
import { Empty, message } from "antd";
import LoadingIndicator from "../../components/LoadingIndicator";
import { GroupResource } from "../../types/group";
import { GroupInvitationResource } from "../../types/group-invitation";
import InviteMemberPending from "../../components/groups/components/InviteMemberPending";
import { useInfiniteScroll } from "../../hooks/useInfiniteScroll";

const GroupPendingInvitesPage: FC = () => {
    const { id } = useParams();
    const [group, setGroup] = useState<GroupResource>()
    const [pendingInvites, setPendingInvites] = useState<GroupInvitationResource[]>([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState(inititalValues);

    const navigate = useNavigate()

    const fetchPendingInvites = async (page: number, size: number) => {
        if (id) {
            setLoading(true)
            const response = await groupService.getAllPendingInvitesByGroupId(id, page, size);
            setLoading(false)
            if (response.isSuccess) {

                setPendingInvites(prev => {
                    const existingIds = new Set(prev.map(item => item.id));
                    const news = response.data.filter(item => !existingIds.has(item.id));
                    return [...prev, ...news];
                });

                setPagination(response.pagination)
            }
        }
    }

    const fetchNextPage = () => {
        if (!pagination.hasMore || loading) return;
        fetchPendingInvites(pagination.page + 1, pagination.size)
    }

    const { containerRef } = useInfiniteScroll({
        fetchMore: () => fetchNextPage(),
        hasMore: pagination.hasMore,
        loading: loading,
        rootMargin: "50px",
        triggerId: "pending-invites-scroll-trigger",
    });


    const fetchGroup = async () => {
        if (id) {
            const response = await groupService.getGroupById(id);
            if (response.isSuccess) {
                setGroup(response.data);
            } else {
                navigate('/404')
            }
        }

    }

    useEffect(() => {
        if (group && !group?.onlyAdminCanApprovalMember) navigate('/404')
    }, [group])

    useEffect(() => {
        fetchGroup()
        fetchPendingInvites(pagination.page, pagination.size)
    }, [id])

    const handleRejectInvite = async (requestId: string) => {
        const response = await groupService.adminRejectInviteFriend(requestId);
        if (response.isSuccess) {
            message.success(response.message)
            setPendingInvites(prev => [...prev.filter(p => p.id !== requestId)])
        } else {
            message.error(response.message)
        }
    }

    const handleApprovalInvite = async (requestId: string) => {
        const response = await groupService.adminAcceptInviteFriend(requestId);
        if (response.isSuccess) {
            message.success(response.message);
            setPendingInvites(prev => [...prev.filter(p => p.id !== requestId)])
        } else {
            message.error(response.message)
        }
    }

    return <div ref={containerRef} className="w-full h-full overflow-y-auto custom-scrollbar px-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4 px-8">
            {pendingInvites?.map(request => <InviteMemberPending
                onApproval={() => handleApprovalInvite(request.id)}
                onReject={() => handleRejectInvite(request.id)}
                key={request.id}
                invitation={request}
            />)}

        </div>
        {!loading && pendingInvites.length === 0 && <Empty description='Không có lời mời nào đang chờ phê duyệt' />}
        {loading && <LoadingIndicator />}
        <div id="pending-invites-scroll-trigger" className="w-full h-1" />
    </div>
};

export default GroupPendingInvitesPage;
