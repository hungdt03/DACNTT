import { FC } from "react";
import images from "../../../assets";
import { SearchUserSuggestResource } from "../../../types/search/search-user-suggest";
import SearchUserItem from "../SearchUserItem";

type SearchUserBlockProps = {
    users: SearchUserSuggestResource[]
}

const SearchUserBlock: FC<SearchUserBlockProps> = ({
    users
}) => {
    return <div className="p-4 shadow border-[1px] border-gray-100 rounded-lg bg-white">
        <span className="text-xl font-bold mb-4 inline-block">Mọi người</span>
        <div className="flex flex-col gap-y-4">
            {users.map(suggestUser =>
                <SearchUserItem key={suggestUser.user.id} suggestUser={suggestUser} />
            )}
            <button className="w-full py-2 text-sm hover:bg-sky-100 rounded-md bg-sky-50 text-primary font-semibold">Xem tất cả</button>
        </div>
    </div>
};

export default SearchUserBlock;
