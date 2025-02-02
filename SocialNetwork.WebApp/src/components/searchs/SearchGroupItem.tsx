import { FC, useState } from "react";
import images from "../../assets";
import { getGroupPrivacyTitle } from "../../utils/privacy";
import { SearchGroupSuggestResource } from "../../types/search/search-group-suggest";
import { Avatar, message } from "antd";
import { Link } from "react-router-dom";
import groupService from "../../services/groupService";

type SearchGroupItemProps = {
    suggestGroup: SearchGroupSuggestResource
}

const SearchGroupItem: FC<SearchGroupItemProps> = ({
    suggestGroup
}) => {

    const [isApproval, setIsApproval] = useState<boolean>(false);
    const [isSubmit, setIsSubmit] = useState(false)

    const handleJoinGroup = async (groupId: string) => {
        const response = await groupService.createRequestJoinGroup(groupId);
        if (response.isSuccess) {
            setIsApproval(response.data.isApproval)
            setIsSubmit(true)
            message.success(response.message)
        } else {
            message.error(response.message)
        }


    }
    return <div className="p-4 rounded-md bg-white flex items-center justify-between shadow">
        <div className="flex items-center gap-x-3">
            <img src={suggestGroup.group.coverImage ?? images.cover} className="w-[55px] h-[55px] rounded-md border-[1px] border-gray-100" />
            <div className="flex flex-col">
                <span className="font-semibold text-[16px] line-clamp-1">{suggestGroup.group.name}</span>
                <div className="flex items-center gap-x-3">
                    {suggestGroup.isMember && <span className="text-gray-600 text-sm">
                        Nhóm của bạn
                    </span>}
                    <span className="text-gray-600 text-sm">
                        {getGroupPrivacyTitle(suggestGroup.group.privacy)}
                    </span>
                    <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
                    <span className="text-gray-600 text-sm">
                        {suggestGroup.totalMembers} thành viên
                    </span>
                </div>

                {suggestGroup.countFriendMembers > 0 && <div className="flex items-center gap-x-3">
                    <Avatar.Group>
                        {suggestGroup.friendMembers.map(member => <Avatar key={member.id} src={member.avatar} size='small' />)}
                    </Avatar.Group>
                    <span className="text-gray-600 text-sm">{suggestGroup.countFriendMembers} người bạn là thành viên</span>
                </div>}
            </div>
        </div>

        {suggestGroup.isMember || isApproval
            ? <Link className="px-3 py-1 rounded-md bg-sky-50 font-semibold text-primary hover:bg-sky-100" to={`/groups/${suggestGroup.group.id}`}>Truy cập</Link>
            : (isSubmit && !isApproval ? <button className="px-3 py-1 text-sm rounded-md bg-sky-50 font-semibold text-primary">Đang chờ</button>
                : <button onClick={() => handleJoinGroup(suggestGroup.group.id)} className="px-3 py-1 rounded-md bg-sky-50 font-semibold text-primary hover:bg-sky-100">Tham gia</button>)
        }
    </div>
};

export default SearchGroupItem;
