import { FC, useEffect, useState } from "react";
import { inititalValues } from "../../utils/pagination";
import groupService from "../../services/groupService";
import { Empty, message } from "antd";
import LoadingIndicator from "../../components/LoadingIndicator";
import { GroupInvitationResource } from "../../types/group-invitation";
import { useElementInfinityScroll } from "../../hooks/useElementInfinityScroll";
import GroupPendingInvite from "../../components/groups/components/GroupPendingInvite";

const GroupMyPendingInvitesPage: FC = () => {
    const [pendingInvites, setPendingInvites] = useState<GroupInvitationResource[]>([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState(inititalValues);

    const fetchPendingInvites = async (page: number, size: number) => {
        setLoading(true)
        const response = await groupService.getAllPendingInvitesByCurrentUser(page, size);
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

    const fetchNextPage = () => {
        if (!pagination.hasMore || loading) return;
        fetchPendingInvites(pagination.page + 1, pagination.size)
    }

    useElementInfinityScroll({
        elementId: "pending-invites",
        onLoadMore: fetchNextPage,
        isLoading: loading,
        hasMore: pagination.hasMore,
    });

    useEffect(() => {
        fetchPendingInvites(pagination.page, pagination.size)
    }, [])

    const handleRejectInvite = async (requestId: string) => {
        const response = await groupService.rejectInviteFriend(requestId);
        if (response.isSuccess) {
            message.success(response.message)
            setPendingInvites(prev => [...prev.filter(p => p.id !== requestId)])
        } else {
            message.error(response.message)
        }
    }

    const handleAcceptedInvite = async (requestId: string) => {
        const response = await groupService.acceptInviteFriend(requestId);
        if (response.isSuccess) {
            message.success(response.message);
            setPendingInvites(prev => [...prev.filter(p => p.id !== requestId)])
        } else {
            message.error(response.message)
        }
    }

    return <div id="pending-invites" className="w-full h-full overflow-y-auto custom-scrollbar px-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4 px-8">
            {pendingInvites.map(invitation => <GroupPendingInvite
                key={invitation.id}
                onAccepted={() => handleAcceptedInvite(invitation.id)}
                onRejected={() => handleRejectInvite(invitation.id)}
                invitation={invitation}
            />)}
        </div>
        {!loading && pendingInvites.length === 0 && <Empty description='Không có lời mời nào đang chờ' />}
        {loading && <LoadingIndicator />}
    </div>
};

export default GroupMyPendingInvitesPage;
