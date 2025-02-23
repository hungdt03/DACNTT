import { FC, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { GroupMemberResource } from "../../types/group-member";
import { Pagination } from "../../types/response";
import { inititalValues } from "../../utils/pagination";
import groupService from "../../services/groupService";
import GroupMember from "../../components/groups/components/GroupMember";
import { useInfiniteScroll } from "../../hooks/useInfiniteScroll";
import LoadingIndicator from "../../components/LoadingIndicator";
import { Search } from "lucide-react";
import { GroupResource } from "../../types/group";
import { Dropdown, Empty, message, Modal } from "antd";
import ChooseNewAdminModal from "../../components/modals/ChooseNewAdminModal";
import useModal from "../../hooks/useModal";
import { MemberRole } from "../../enums/member-role";
import Loading from "../../components/Loading";
import useDebounce from "../../hooks/useDebounce";

export const MEMBER_VALUES = [
    { key: "ALL", label: "Tất cả" },
    { key: "ADMIN", label: "Quản trị viên" },
    { key: "MODERATOR", label: "Người kiểm duyệt" },
    { key: "MEMBER", label: "Thành viên" }
];

export type RoleFilter = 'ALL' | 'MEMBER' | 'ADMIN' | 'MODERATOR'

const GroupMemberPage: FC = () => {
    const { id } = useParams()
    const navigate = useNavigate()

    const [members, setMembers] = useState<GroupMemberResource[]>([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState<Pagination>(inititalValues);

    const [searchValue, setSearchValue] = useState('');
    const [group, setGroup] = useState<GroupResource>();
    const [selectMember, setSelectMember] = useState<GroupMemberResource>()
    const { isModalOpen, handleCancel, handleOk, showModal } = useModal();
    const [groupLoading, setGroupLoading] = useState(false);
    const [role, setRole] = useState<RoleFilter>('ALL');
    const debouncedValue = useDebounce(searchValue, 300)

    const { containerRef } = useInfiniteScroll({
        fetchMore: () => void fetchMoreMembers(),
        hasMore: pagination.hasMore,
        loading: loading,
        rootMargin: "50px",
        triggerId: "members-scroll-trigger",
    });

    const fetchGroup = async () => {
        if (id) {
            setGroupLoading(true)
            const response = await groupService.getGroupById(id);
            setGroupLoading(false)
            if (response.isSuccess) {
                setGroup(response.data)
            } else {
                navigate('/404')
            }
        }
    }

    const fetchMembers = async (page: number, size: number) => {
        if (id) {
            setLoading(true)
            const response = await groupService.getAllMembersByGroupId(id, page, size, searchValue, role);
            setLoading(false)
            if (response.isSuccess) {
                if (page === 1) {
                    setMembers(response.data)
                } else {
                    setMembers(prevMembers => {
                        const existingIds = new Set(prevMembers.map(m => m.user.id));
                        const newMembers = response.data.filter(m => !existingIds.has(m.user.id));
                        return [...prevMembers, ...newMembers];
                    });
                }
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

    const handleLeaveGroup = async (groupId: string, memberId?: string) => {
        const response = await groupService.leaveGroup(groupId, memberId);
        if (response.isSuccess) {
            message.success(response.message);
            navigate('/groups')
        } else {
            message.error(response.message)
        }
    }

    const handleInviteAsAdmin = async (memberId: string) => {
        const response = await groupService.inviteAsAdmin(memberId);
        if (response.isSuccess) {
            setMembers(prevMembers => {
                const updateMembers = [...prevMembers];
                const findIndex = updateMembers.findIndex(m => m.id === memberId);
                if (findIndex > 0) {
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
        if (response.isSuccess) {
            setMembers(prevMembers => {
                const updateMembers = [...prevMembers];
                const findIndex = updateMembers.findIndex(m => m.id === memberId);
                if (findIndex > 0) {
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
        if (response.isSuccess) {
            setMembers(prevMembers => {
                const updateMembers = [...prevMembers];
                const findIndex = updateMembers.findIndex(m => m.id === memberId);
                if (findIndex > 0) {
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

    const handleRevokeRole = async (memberId: string) => {
        const response = await groupService.revokeMemberPermission(memberId);

        if (response.isSuccess) {
            setMembers(prevMembers => {
                const updateMembers = [...prevMembers];
                const findIndex = updateMembers.findIndex(m => m.id === memberId);
                if (findIndex > 0) {
                    updateMembers[findIndex].isInvitedAsModerator = false;
                    updateMembers[findIndex].isInvitedAsAdmin = false;
                    updateMembers[findIndex].role = MemberRole.MEMBER;
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

    useEffect(() => {
        fetchMembers(1, 6)
    }, [role, debouncedValue])

    return <div className="w-full">
        {groupLoading && <Loading />}
        <div className="w-full flex items-center justify-center bg-white shadow sticky top-0 z-10">
            <div className="lg:max-w-screen-lg md:max-w-screen-md max-w-screen-sm mx-auto px-4 w-full py-3 flex flex-col gap-y-3">
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
                    <Dropdown
                        menu={{
                            items: MEMBER_VALUES.map(item => ({
                                key: item.key,
                                label: (
                                    <button className="py-1 text-left" onClick={() => setRole(item.key as RoleFilter)}>
                                        {item.label}
                                    </button>
                                ),
                            })),
                        }}
                        placement="bottom"
                    >
                        <button className="py-[6px] px-8 text-sm rounded-md font-semibold bg-gray-100 hover:bg-gray-200">
                            {MEMBER_VALUES.find(item => item.key === role)?.label ?? 'Lọc theo quyền'}    
                        </button>
                    </Dropdown>
                </div>
            </div>
        </div>

        <div className="w-full h-full lg:max-w-screen-lg md:max-w-screen-md max-w-screen-sm mx-auto py-6 px-2">
            <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {!groupLoading && group && members.map(member => <GroupMember
                    group={group}
                    countMember={members.length}
                    adminCount={group.adminCount}
                    onKickMember={() => handleKickMember(member.id)}
                    isMine={group.isMine}
                    key={member.id}
                    member={member}
                    onChooseNewAdmin={showModal}
                    onLeaveGroup={() => handleLeaveGroup(group.id)}
                    onCancelInviteAsAdmin={() => handleCancelInvitation(member.id)}
                    onCancelInviteAsModerator={() => handleCancelInvitation(member.id)}
                    onInviteAsAdmin={() => handleInviteAsAdmin(member.id)}
                    onInviteAsModerator={() => handleInviteAsModerator(member.id)}
                    onRevokeRole={() => handleRevokeRole(member.id)}
                />)}
            </div>

            <div id="members-scroll-trigger" className="w-full h-1" />
            {!loading && members.length === 0 && <Empty description='Không có thành viên nào' />}
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
            {group && <ChooseNewAdminModal
                selectMember={selectMember}
                onChange={(newSelect) => setSelectMember(newSelect)}
                group={group}
            />}
        </Modal>

    </div>
};

export default GroupMemberPage;
