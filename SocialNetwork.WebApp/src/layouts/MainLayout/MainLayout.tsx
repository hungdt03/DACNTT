import { FC } from "react";
import Header from "../shared/Header";
import { Outlet } from "react-router-dom";
import MainLeftSidebar from "./components/MainLeftSidebar";
import MainRightSidebar from "./components/MainRightSidebar";
import PopupWrapper from "../../components/chats/PopupWrapper";
import MinimizePopupWrapper from "../../components/chats/MinimizePopupWrapper";
import useTitle from "../../hooks/useTitle";

const MainLayout: FC = () => {
    useTitle('Trang chủ');
    
    return <div className="flex flex-col w-screen h-screen overflow-y-hidden">
        <Header />
        <div className="bg-slate-100 w-full h-full">
            <div className="xl:max-w-screen-xl lg:max-w-screen-lg md:max-w-screen-md max-w-screen-sm px-2 md:px-4 lg:px-0 mx-auto w-full h-full grid grid-cols-12 gap-6 overflow-hidden">
                <MainLeftSidebar />
                <div className="h-full flex flex-col gap-6 overflow-y-auto scrollbar-hide col-span-12 lg:col-span-8 xl:col-span-6 py-3 md:py-6 md:px-0">
                    <Outlet />
                </div>
                <MainRightSidebar />
            </div>

        </div>

        <div className="absolute right-24 bottom-0 flex gap-x-4">
            <PopupWrapper />
        </div>

        <div className="absolute right-8 bottom-8 flex gap-x-4">
            <div className="flex flex-col gap-2">
                <MinimizePopupWrapper />
            </div>
        </div>
    </div>
};

export default MainLayout;
