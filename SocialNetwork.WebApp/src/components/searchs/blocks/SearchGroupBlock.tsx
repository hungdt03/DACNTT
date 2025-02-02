import { FC } from "react";
import images from "../../../assets";
import { Avatar } from "antd";
import { getGroupPrivacyTitle } from "../../../utils/privacy";
import { SearchGroupSuggestResource } from "../../../types/search/search-group-suggest";
import SearchGroupItem from "../SearchGroupItem";

type SearchGroupBlockProps = {
    groups: SearchGroupSuggestResource[]
}

const SearchGroupBlock: FC<SearchGroupBlockProps> = ({
    groups
}) => {
    return <div className="p-4 shadow border-[1px] border-gray-100 rounded-lg bg-white">
        <span className="text-xl font-bold mb-4 inline-block">Nhóm</span>
        <div className="flex flex-col gap-y-4">

            {groups.map(suggestGroup => 
                <SearchGroupItem key={suggestGroup.group.id} suggestGroup={suggestGroup} />
            )}
            <button className="w-full py-2 text-sm hover:bg-sky-100 rounded-md bg-sky-50 text-primary font-semibold">Xem tất cả</button>
        </div>
    </div>
};

export default SearchGroupBlock;
