import { FC } from "react";
import { Outlet } from "react-router-dom";
import Header from "../shared/Header";

const HeaderOnlyLayout: FC = () => {
    return <div className="flex flex-col">
        <Header />
        <Outlet />
    </div>
};

export default HeaderOnlyLayout;
