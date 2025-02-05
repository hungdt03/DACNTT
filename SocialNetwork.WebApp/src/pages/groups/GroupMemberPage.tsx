import { FC, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { GroupMemberResource } from "../../types/group-member";
import { Pagination } from "../../types/response";
import { inititalValues } from "../../utils/pagination";
import groupService from "../../services/groupService";
import GroupMember from "../../components/groups/components/GroupMember";
import { useInfiniteScroll } from "../../hooks/useInfiniteScroll";
import LoadingIndicator from "../../components/LoadingIndicator";
import { Search } from "lucide-react";
import { GroupResource } from "../../types/group";
import { message, Modal } from "antd";
import ChooseNewAdminModal from "../../components/modals/ChooseNewAdminModal";
import useModal from "../../hooks/useModal";

const GroupMemberPage: FC = () => {
    const { id } = useParams()

    const [members, setMembers] = useState<GroupMemberResource[]>([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState<Pagination>(inititalValues);

    const [searchValue, setSearchValue] = useState('');
    const [group, setGroup] = useState<GroupResource>();
    const [selectMember, setSelectMember] = useState<GroupMemberResource>()
    const { isModalOpen, handleCancel, handleOk, showModal } = useModal()

    const { containerRef } = useInfiniteScroll({
        fetchMore: () => void fetchMoreMembers(),
        hasMore: pagination.hasMore,
        loading: loading,
        rootMargin: "50px",
        triggerId: "members-scroll-trigger",
    });

    const fetchGroup = async () => {
        if (id) {
            const response = await groupService.getGroupById(id);
            if (response.isSuccess) {
                setGroup(response.data)
            }
        }
    }

    const fetchMembers = async (page: number, size: number) => {
        if (id) {
            setLoading(true)
            const response = await groupService.getAllMembersByGroupId(id, page, size);
            setLoading(false)
            if (response.isSuccess) {
                setMembers(prevMembers => {
                    const existingIds = new Set(prevMembers.map(m => m.user.id));
                    const newMembers = response.data.filter(m => !existingIds.has(m.user.id));
                    return [...prevMembers, ...newMembers];
                });
                setPagination(response.pagination)
            }
        }
    }

    const fetchMoreMembers = async () => {
        if (!pagination.hasMore || loading) return;
        fetchMembers(pagination.page + 1, pagination.size);
    };

    const handleKickMember = async (memberId: string) => {
        const response = await groupService.kickMember(memberId);
        if (response.isSuccess) {
            message.success(response.message);
            setMembers(prevMembers => [...prevMembers.filter(m => m.id !== memberId)])
        } else {
            message.error(response.message)
        }
    }

    const handleLeaveGroup = async (groupId: string, memberId: string) => {
        const response = await groupService.leaveGroup(groupId, memberId);
        if (response.isSuccess) {
            message.success(response.message);
            setMembers(prevMembers => [...prevMembers.filter(m => m.id !== memberId)])
        } else {
            message.error(response.message)
        }
    }

    const handleInviteAsAdmin = async (memberId: string) => {
        const response = await groupService.inviteAsAdmin(memberId);
        if(response.isSuccess) {
            setMembers(prevMembers => {
                const updateMembers = [...prevMembers];
                const findIndex = updateMembers.findIndex(m => m.id === memberId);
                if(findIndex > 0) {
                    updateMembers[findIndex].isInvitedAsAdmin = true;
                    updateMembers[findIndex].isInvitedAsModerator = false;
                }

                return updateMembers
            })
            message.success(response.message)
        } else {
            message.error(response.message)
        }
    }

    const handleInviteAsModerator = async (memberId: string) => {
        const response = await groupService.inviteAsModerator(memberId);
        if(response.isSuccess) {
            setMembers(prevMembers => {
                const updateMembers = [...prevMembers];
                const findIndex = updateMembers.findIndex(m => m.id === memberId);
                if(findIndex > 0) {
                    updateMembers[findIndex].isInvitedAsModerator = true;
                    updateMembers[findIndex].isInvitedAsAdmin = false;
                }

                return updateMembers
            })
            message.success(response.message)
        } else {
            message.error(response.message)
        }
    }

    const handleCancelInvitation = async (memberId: string) => {
        const response = await groupService.cancelRoleInvitation(memberId);
        if(response.isSuccess) {
            setMembers(prevMembers => {
                const updateMembers = [...prevMembers];
                const findIndex = updateMembers.findIndex(m => m.id === memberId);
                if(findIndex > 0) {
                    updateMembers[findIndex].isInvitedAsModerator = false;
                    updateMembers[findIndex].isInvitedAsAdmin = false;
                }

                return updateMembers
            })
            message.success(response.message)
        } else {
            message.error(response.message)
        }
    }

    useEffect(() => {
        fetchGroup();
        fetchMembers(pagination.page, pagination.size)
    }, [id]);

    return <div className="w-full">
        <div className="w-full flex items-center justify-center bg-white shadow sticky top-0 z-10">
            <div className="max-w-screen-lg w-full py-3 flex flex-col gap-y-3">
                <div className="flex items-center gap-x-2">
                    <span className="text-xl font-bold">Tổng số thành viên</span>
                    <span className="w-1 h-1 rounded-full bg-gray-500"></span>
                    <span className="text-xl font-bold">{members.length}</span>
                </div>
                <div className="flex items-center gap-x-4">
                    <div className="px-4 flex items-center gap-x-2 rounded-3xl bg-gray-100">
                        <Search size={14} />
                        <input value={searchValue} onChange={e => setSearchValue(e.target.value)} placeholder="Tìm kiếm" className="px-2 py-1 w-full bg-gray-100 outline-none border-none" />
                    </div>
                </div>
            </div>
        </div>

        <div className="w-full h-full max-w-screen-lg mx-auto py-6">
            <div ref={containerRef} className="grid grid-cols-2 gap-4">
                {group && members.map(member => <GroupMember
                    countMember={members.length}
                    adminCount={group.adminCount}
                    onKickMember={() => handleKickMember(member.id)}
                    isMine={group.isMine}
                    key={member.id}
                    member={member}
                    onChooseNewAdmin={showModal}
                    onLeaveGroup={() => handleLeaveGroup(group.id, member.id)}
                    onCancelInviteAsAdmin={() => handleCancelInvitation(member.id)}
                    onCancelInviteAsModerator={() => handleCancelInvitation(member.id)}
                    onInviteAsAdmin={() => handleInviteAsAdmin(member.id)}
                    onInviteAsModerator={() => handleInviteAsModerator(member.id)}
                />)}
            </div>

            <div id="members-scroll-trigger" className="w-full h-1" />

            {loading && (
                <LoadingIndicator />
            )}
        </div>

        <Modal
            title={<p className="text-center font-semibold text-xl">Rời nhóm</p>}
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            okText='Rời nhóm'
            cancelText='Hủy bỏ'
            okButtonProps={{
                disabled: !selectMember,
                onClick: () => group && selectMember && void handleLeaveGroup(group.id, selectMember.id)
            }}
        >
            {id && <ChooseNewAdminModal
                selectMember={selectMember}
                onChange={(newSelect) => setSelectMember(newSelect)}
                groupId={id}
            />}
        </Modal>

    </div>
};

export default GroupMemberPage;
