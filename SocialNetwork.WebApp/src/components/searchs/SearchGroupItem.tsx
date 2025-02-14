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

    return <Link to={`/groups/${suggestGroup.group.id}`} className="p-4 rounded-md bg-white flex items-center justify-between shadow">
        <div className="flex items-center gap-x-3">
            <img src={suggestGroup.group.coverImage ?? images.cover} className="w-[55px] h-[55px] rounded-md border-[1px] border-gray-100" />
            <div className="flex flex-col">
                <span className="font-semibold text-sm md:text-[16px] line-clamp-1">{suggestGroup.group.name}</span>
                <div className="flex items-center flex-wrap gap-x-2 md:gap-3">
                    {suggestGroup.isMember && <span className="text-gray-600 text-xs md:text-sm">
                        Nhóm của bạn
                    </span>}
                    <span className="text-gray-600 text-xs md:text-sm">
                        {getGroupPrivacyTitle(suggestGroup.group.privacy)}
                    </span>
                    <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
                    <span className="text-gray-600 text-xs md:text-sm">
                        {suggestGroup.totalMembers} thành viên
                    </span>
                </div>

                {suggestGroup.countFriendMembers > 0 && <div className="flex items-center gap-x-3">
                    <Avatar.Group>
                        {suggestGroup.friendMembers.map(member => <Avatar key={member.id} src={member.avatar} size='small' />)}
                    </Avatar.Group>
                    <span className="text-gray-600 text-xs md:text-sm">{suggestGroup.countFriendMembers} người bạn là thành viên</span>
                </div>}
            </div>
        </div>
    </Link>
};

export default SearchGroupItem;
