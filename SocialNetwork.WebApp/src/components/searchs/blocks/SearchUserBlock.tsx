import { FC } from "react";
import { SearchUserSuggestResource } from "../../../types/search/search-user-suggest";
import SearchUserItem from "../SearchUserItem";
import { Link } from "react-router-dom";

type SearchUserBlockProps = {
    users: SearchUserSuggestResource[];
    searchValue: string;
}

const SearchUserBlock: FC<SearchUserBlockProps> = ({
    users,
    searchValue
}) => {
    return <div className="p-4 shadow border-[1px] border-gray-100 rounded-lg bg-white">
        <span className="text-[16px] md:text-xl font-semibold md:font-bold mb-4 inline-block">Mọi người</span>
        <div className="flex flex-col gap-y-4">
            {users.map(suggestUser =>
                <SearchUserItem key={suggestUser.user.id} suggestUser={suggestUser} />
            )}
            <Link to={`/search/?type=user&q=${searchValue}`} className="w-full py-2 text-sm hover:bg-sky-100 rounded-md bg-sky-50 text-primary font-semibold">Xem tất cả</Link>
        </div>
    </div>
};

export default SearchUserBlock;
