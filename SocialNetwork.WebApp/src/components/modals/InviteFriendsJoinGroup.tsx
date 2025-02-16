import { Avatar, Button, Divider } from "antd";
import { CheckCheck, Search, X } from "lucide-react";
import { FC, useEffect, useState } from "react";
import images from "../../assets";
import { InvitableFriendResource } from "../../types/invitable-friend";
import friendService from "../../services/friendService";
import { FriendResource } from "../../types/friend";
import useDebounce from "../../hooks/useDebounce";

type InviteFriendsJoinGroupProps = {
    groupId: string;
    onChange?: (friendIds: string[]) => void
}

const InviteFriendsJoinGroup: FC<InviteFriendsJoinGroupProps> = ({
    groupId,
    onChange
}) => {
    const [friends, setFriends] = useState<InvitableFriendResource[]>([]);
    const [selectFriends, setSelectFriends] = useState<FriendResource[]>([]);
    const [searchValue, setSearchValue] = useState('');
    const debouncedValue = useDebounce(searchValue, 300);

    const fetchInvitableFriends = async (search: string) => {
        const response = await friendService.getInvitableFriends(groupId, search);
        if (response.isSuccess) {
            setFriends(response.data)
        }
    }

    useEffect(() => {
        fetchInvitableFriends(debouncedValue)
    }, [debouncedValue, groupId])

    const handlePushFriendIntoSelectedList = (friend: FriendResource) => {
        const checkExisted = selectFriends.find(f => f.id === friend.id);

        if (!checkExisted) {
            const updateSelectedFriends = [...selectFriends, friend]
            setSelectFriends(updateSelectedFriends)
            setFriends(prev => [...prev.filter(f => f.friend.id !== friend.id)])
            onChange?.(updateSelectedFriends.map(item => item.id))
        }
    }

    const handleRemoveFriendFromSelectedList = (friend: FriendResource) => {
        const checkExisted = selectFriends.find(f => f.id === friend.id);

        if (checkExisted) {
            const updateSelectedFriends = [...selectFriends.filter(f => f.id !== friend.id)]
            setSelectFriends(updateSelectedFriends)
            setFriends(prev => [{
                friend,
                isMember: false,
                haveInvited: false,
            }, ...prev])
            onChange?.(updateSelectedFriends.map(item => item.id))
        }
    }


    return <div className="max-h-[500px] h-[500px]">
        <Divider className="my-0" />
        <div className="flex flex-col md:grid grid-cols-3 h-full">
            <div className="col-span-2 p-2 flex flex-col gap-y-2 h-full overflow-y-hidden">
                <div className="px-3 py-1 bg-gray-100 flex items-center gap-x-1 rounded-3xl overflow-hidden">
                    <Search size={16} className="text-gray-500" />
                    <input value={searchValue} onChange={e => setSearchValue(e.target.value)} placeholder="Tìm kiếm bạn bè theo tên" className="bg-gray-100 outline-none px-2 py-2 w-full h-full" />
                </div>

                <div className="pl-2 flex flex-col gap-y-2 h-full overflow-y-auto custom-scrollbar">
                    <span className="text-sm uppercase font-semibold text-gray-500">Gợi ý</span>

                    <div className="flex flex-col gap-y-2">
                        {friends.map(invitableFriend => <div key={invitableFriend.friend.id} className="flex items-center justify-between px-2 py-2 rounded-lg hover:bg-gray-100">
                            <div className="flex items-center gap-x-2">
                                <Avatar size={'default'} src={invitableFriend.friend.avatar ?? images.user} />
                                <span className="text-[14px] text-gray-600 font-semibold">{invitableFriend.friend.fullName}</span>
                            </div>

                            {invitableFriend.isMember
                                ? <button className="py-1 px-3 rounded-mg bg-gray-50 font-semibold text-sm">Thành viên</button>
                                : invitableFriend.haveInvited ? <button className="py-1 px-3 rounded-mg bg-gray-50 font-semibold text-sm">Đã mời</button> : <Button onClick={() => handlePushFriendIntoSelectedList(invitableFriend.friend)} type='primary' icon={<CheckCheck />}>Mời</Button>}
                        </div>)}
                    </div>
                </div>
            </div>
            <div className="col-span-1 bg-slate-100 p-2 flex flex-col gap-y-2 h-full overflow-y-auto custom-scrollbar">
                <span className="text-xs uppercase font-semibold text-gray-500">Đã chọn {selectFriends.length} người bạn</span>

                <div className="flex flex-col gap-y-4">
                    {selectFriends.map(friend => <div key={friend.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-x-2">
                            <Avatar size={'default'} src={friend.avatar ?? images.user} />
                            <span className="text-[14px] text-gray-600 font-semibold">{friend.fullName}</span>
                        </div>
                        <button onClick={() => handleRemoveFriendFromSelectedList(friend)} className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-gray-200">
                            <X size={18} className="text-gray-500" />
                        </button>
                    </div>)}
                </div>
            </div>
        </div>
        <Divider className="my-0" />
    </div>
};

export default InviteFriendsJoinGroup;
