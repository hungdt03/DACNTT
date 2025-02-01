import { FC } from "react";
import HeaderFullWidth from "../shared/HeaderFullWidth";
import { Outlet } from "react-router-dom";
import SearchSidebar from "./components/SearchSidebar";

const SearchLayout: FC = () => {
    return <div className="flex flex-col bg-slate-100 w-screen h-screen">
        <HeaderFullWidth />

        <div className="grid grid-cols-12 gap-4 h-full w-full overflow-hidden">
            <SearchSidebar />
            <div className="col-span-9 h-full overflow-y-auto custom-scrollbar ">
                <Outlet />
            </div>
        </div>
    </div>
};

export default SearchLayout;
