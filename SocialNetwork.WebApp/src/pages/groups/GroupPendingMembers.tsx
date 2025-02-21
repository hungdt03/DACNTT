import { FC, useEffect, useState } from "react";
import PendingMember from "../../components/groups/components/PendingMember";
import { JoinGroupRequestResource } from "../../types/join-group";
import { inititalValues } from "../../utils/pagination";
import { useParams } from "react-router-dom";
import groupService from "../../services/groupService";
import { Empty, message } from "antd";
import LoadingIndicator from "../../components/LoadingIndicator";
import { useInfiniteScroll } from "../../hooks/useInfiniteScroll";

const GroupPendingMembers: FC = () => {
    const { id } = useParams()
    const [pendingRequests, setPendingRequests] = useState<JoinGroupRequestResource[]>();
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState(inititalValues)

    const fetchPendingRequests = async (page: number, size: number) => {
        if (id) {
            setLoading(true)
            const response = await groupService.getAllJoinGroupRequestByGroupId(id, page, size);
            setLoading(false)
            if (response.isSuccess) {
                setPendingRequests(response.data)
                setPagination(response.pagination)
            }
        }
    }

    useEffect(() => {
        fetchPendingRequests(pagination.page, pagination.size)
    }, [id])

    const fetchNextPage = () => {
        if (!pagination.hasMore || loading) return;
        fetchPendingRequests(pagination.page + 1, pagination.size);
    }

    const { containerRef } = useInfiniteScroll({
        fetchMore: () => fetchNextPage(),
        hasMore: pagination.hasMore,
        loading: loading,
        rootMargin: "50px",
        triggerId: "pending-members-scroll-trigger",
    });

    const handleRejectRequest = async (requestId: string) => {
        const response = await groupService.rejectRequestJoinGroup(requestId);
        if (response.isSuccess) {
            message.success(response.message)
            fetchPendingRequests(1, 6)
        } else {
            message.error(response.message)
        }
    }

    const handleApprovalRequest = async (requestId: string) => {
        const response = await groupService.approvalRequestJoinGroup(requestId);
        if (response.isSuccess) {
            message.success(response.message);
            fetchPendingRequests(1, 6)
        } else {
            message.error(response.message)
        }
    }

    return <div ref={containerRef} className="w-full h-full overflow-y-auto custom-scrollbar px-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4 px-8">
            {pendingRequests?.map(request => <PendingMember
                onApproval={() => handleApprovalRequest(request.id)}
                onReject={() => handleRejectRequest(request.id)}
                key={request.id}
                request={request}
            />)}
        </div>

        {loading && <LoadingIndicator />}
        {!loading && pendingRequests?.length === 0 && <Empty description='Không có yêu cầu tham gia nhóm nào' />}
        <div id="pending-members-scroll-trigger" className="w-full h-1" />
    </div>
};

export default GroupPendingMembers;
