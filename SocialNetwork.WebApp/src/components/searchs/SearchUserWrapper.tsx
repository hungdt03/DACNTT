import { FC } from "react";
import SearchUserItem from "./SearchUserItem";

const SearchUserWrapper: FC = () => {
    return <div className="flex flex-col gap-y-4 w-full h-full custom-scrollbar overflow-y-auto">
        <SearchUserItem />
        <SearchUserItem />
        <SearchUserItem />
        <SearchUserItem />
        <SearchUserItem />
        <SearchUserItem />
        <SearchUserItem />
        <SearchUserItem />
        <SearchUserItem />
        <SearchUserItem />
        <SearchUserItem />
    </div>
};

export default SearchUserWrapper;
