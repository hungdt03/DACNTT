import { FC } from "react";
import { Outlet } from "react-router-dom";
import HeaderFullWidth from "../shared/HeaderFullWidth";

const HeaderFullWidthLayout: FC = () => {
    return <div className="flex flex-col bg-slate-100 h-screen w-screen">
        <HeaderFullWidth />
        <Outlet />
    </div>
};

export default HeaderFullWidthLayout;
