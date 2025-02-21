import { FC } from "react";
import HeaderFullWidth from "../shared/HeaderFullWidth";
import { Outlet } from "react-router-dom";
import SearchSidebar from "./components/SearchSidebar";
import SearchMenuMobile from "./components/SearchMenuMobile";
import useTitle from "../../hooks/useTitle";

const SearchLayout: FC = () => {
    useTitle('Tìm kiếm')
    return <div className="flex flex-col bg-slate-100 w-screen h-screen">
        <HeaderFullWidth />
        <div className="grid grid-cols-12 h-full w-full overflow-hidden">
            <SearchSidebar />
            <div className="lg:col-span-9 col-span-12 h-full overflow-y-auto custom-scrollbar">
                <SearchMenuMobile />
                <Outlet />
            </div>
        </div>
    </div>
};

export default SearchLayout;
