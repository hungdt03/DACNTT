import { FC } from "react";
import { Outlet } from "react-router-dom";

const AuthLayout: FC = () => {
    return <div className="grid grid-cols-12 h-screen">
        <div className="hidden md:block md:col-span-5 lg:col-span-7 xl:col-span-8 bg-sky-500">

        </div>
        <div className="col-span-12 md:col-span-7 lg:col-span-5 xl:col-span-4">
            <Outlet />
        </div>
    </div>
};

export default AuthLayout;
