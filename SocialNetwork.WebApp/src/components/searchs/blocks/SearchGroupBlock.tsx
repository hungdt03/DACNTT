import { FC } from "react";
import { SearchGroupSuggestResource } from "../../../types/search/search-group-suggest";
import SearchGroupItem from "../SearchGroupItem";
import { Link, useNavigate } from "react-router-dom";
import searchService from "../../../services/searchService";

type SearchGroupBlockProps = {
    groups: SearchGroupSuggestResource[];
    searchValue: string;
}

const SearchGroupBlock: FC<SearchGroupBlockProps> = ({
    groups,
    searchValue
}) => {
    const navigate = useNavigate();

    const handleRedirectToGroupPage = async (url: string, groupId: string) => {
        await searchService.addSeachGroup(groupId);
        navigate(url)
    }

    return <div className="p-4 shadow border-[1px] border-gray-100 rounded-lg bg-white">
        <span className="text-[16px] md:text-xl font-semibold md:font-bold mb-4 inline-block">Nhóm</span>
        <div className="flex flex-col gap-y-4">

            {groups.map(suggestGroup => 
                <SearchGroupItem onClick={() => handleRedirectToGroupPage(`/groups/${suggestGroup.group.id}`, suggestGroup.group.id)} key={suggestGroup.group.id} suggestGroup={suggestGroup} />
            )}
            <Link to={`/search/group/?q=${searchValue}`} className="w-full py-2 text-sm hover:bg-sky-100 rounded-md bg-sky-50 text-primary text-center font-semibold">Xem tất cả</Link>
        </div>
    </div>
};

export default SearchGroupBlock;
