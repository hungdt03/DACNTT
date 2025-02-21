import { FC } from "react";
import { SearchUserSuggestResource } from "../../../types/search/search-user-suggest";
import SearchUserItem from "../SearchUserItem";
import { Link, useNavigate } from "react-router-dom";
import searchService from "../../../services/searchService";

type SearchUserBlockProps = {
    users: SearchUserSuggestResource[];
    searchValue: string;
}

const SearchUserBlock: FC<SearchUserBlockProps> = ({
    users,
    searchValue
}) => {

    const navigate = useNavigate();

    const handleRedirectToUserPage = async (url: string, userId: string) => {
        await searchService.addSearchUser(userId);
        navigate(url)
    }
    return <div className="p-4 shadow border-[1px] border-gray-100 rounded-lg bg-white">
        <span className="text-[16px] md:text-xl font-semibold md:font-bold mb-4 inline-block">Mọi người</span>
        <div className="flex flex-col gap-y-4">
            {users.map(suggestUser =>
                <SearchUserItem onClick={() => handleRedirectToUserPage(`/profile/${suggestUser.user.id}`, suggestUser.user.id)} key={suggestUser.user.id} suggestUser={suggestUser} />
            )}
            <Link to={`/search/user/?q=${searchValue}`} className="text-center w-full py-2 text-sm hover:bg-sky-100 rounded-md bg-sky-50 text-primary font-semibold">Xem tất cả</Link>
        </div>
    </div>
};

export default SearchUserBlock;
