import { FC } from "react";
import Header from "../shared/Header";
import { Outlet } from "react-router-dom";

import MainLeftSidebar from "./components/MainLeftSidebar";
import MainRightSidebar from "./components/MainRightSidebar";


const MainLayout: FC = () => {
    return <div className="flex flex-col w-screen h-screen overflow-y-hidden">
        <Header />
        <div className="bg-slate-100 w-ful h-full">
            <div className="xl:max-w-screen-xl lg:max-w-screen-lg md:max-w-screen-md max-w-screen-sm px-4 lg:px-0 mx-auto w-full h-full grid grid-cols-12 gap-6 overflow-hidden">
                <MainLeftSidebar />
                <div className="h-full flex flex-col gap-6 overflow-y-auto scrollbar-hide col-span-12 lg:col-span-8 xl:col-span-6 py-6 px-4 md:px-0">
                    <Outlet />
                </div>
                <MainRightSidebar />
            </div>
        </div>
    </div>
};

export default MainLayout;
