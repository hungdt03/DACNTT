import { FC, useEffect, useState } from "react";
import { GroupMemberResource } from "../../types/group-member";
import groupService from "../../services/groupService";
import { inititalValues } from "../../utils/pagination";
import { useInfiniteScroll } from "../../hooks/useInfiniteScroll";
import images from "../../assets";
import LoadingIndicator from "../LoadingIndicator";
import { Button } from "antd";
import { GroupResource } from "../../types/group";

type InviteAdminModalProps = {
    description?: string;
    group: GroupResource;
    selectMember?: GroupMemberResource;
    onChange?: (member: GroupMemberResource) => void
}

const ChooseNewAdminModal: FC<InviteAdminModalProps> = ({
    group,
    description = 'Bạn là quản trị viên cuối cùng của nhóm. Hãy chọn quản trị viên mới để họ duy trì nhóm này sau khi bạn rời đi nhé.',
    selectMember,
    onChange
}) => {
    const [members, setMembers] = useState<GroupMemberResource[]>([]);
    const [pagination, setPagination] = useState(inititalValues);
    const [loading, setLoading] = useState(false);

    const { containerRef } = useInfiniteScroll({
        fetchMore: () => void fetchMoreMembers(),
        hasMore: pagination.hasMore,
        loading: loading,
        rootMargin: "20px",
        triggerId: "nonAdmin-member-scroll-trigger",
    });

    const fetchNonAdminMembers = async (page: number, size: number) => {
        setLoading(true)
        const response = await groupService.getAllNonAdminMembersByGroupId(group.id, page, size);
        setLoading(false)
        if (response.isSuccess) {
            setMembers(response.data)
            setPagination(response.pagination)
        }
    }

    const fetchMoreMembers = async () => {
        if (!pagination.hasMore || loading) return;
        fetchNonAdminMembers(pagination.page + 1, pagination.size);
    };

    useEffect(() => {
        fetchNonAdminMembers(pagination.page, pagination.size)
    }, [group])

    return <div className="flex flex-col gap-y-4 h-[450px]">
        <div className="flex flex-col sticky top-0">
            <span className="text-lg font-bold">Chọn quản trị viên</span>
            <p>{description}</p>
        </div>

        <span className="font-bold text-[15px]">Các thành viên</span>
        <div ref={containerRef} className="flex flex-col gap-y-1 h-full overflow-y-auto custom-scrollbar p-2 border-[1px]">
            {members.map(member => <div key={member.id} className="flex items-center justify-between px-2 py-2 rounded-md hover:bg-gray-100">
                <div className="flex items-center gap-x-4">
                    <img className="w-[30px] h-[30px] object-cover rounded-full" src={member.user.avatar ?? images.cover} />
                    <div className="flex flex-col">
                        <span className="text-[14px] font-semibold text-gray-700">{member.user.fullName}</span>
                    </div>
                </div>

                {selectMember?.id === member.id ?
                    <button className="px-3 py-[4px] rounded-md bg-gray-100 font-semibold">Đã chọn</button>
                    : <Button onClick={() => onChange?.(member)} type="primary" size="small">Chọn</Button>}
            </div>)}

            {loading && <LoadingIndicator />}
            <div id="nonAdmin-member-scroll-trigger" className="w-full h-1" />
        </div>
    </div>
};

export default ChooseNewAdminModal;
