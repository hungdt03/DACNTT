import { FC } from "react";
import { Outlet } from "react-router-dom";
import Header from "../shared/Header";

const HeaderOnlyLayout: FC = () => {
    return <div className="flex flex-col bg-slate-100 w-screen h-screen">
        <Header />
        <Outlet />
    </div>
};

export default HeaderOnlyLayout;
