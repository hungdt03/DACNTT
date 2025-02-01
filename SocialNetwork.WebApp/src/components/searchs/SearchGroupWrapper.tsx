import { FC } from "react";
import SearchGroupItem from "./SearchGroupItem";

const SearchGroupWrapper: FC = () => {
    return <div className="flex flex-col gap-y-4">
        <SearchGroupItem />
        <SearchGroupItem />
        <SearchGroupItem />
        <SearchGroupItem />
    </div>
};

export default SearchGroupWrapper;
