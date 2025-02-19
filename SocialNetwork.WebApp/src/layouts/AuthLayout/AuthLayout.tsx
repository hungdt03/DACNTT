import { FC } from "react";
import { Outlet } from "react-router-dom";
import images from "../../assets";

const AuthLayout: FC = () => {
    return <div className="w-screen h-screen flex items-center justify-center bg-gray-100 px-4 lg:px-0">
        <div className="grid grid-cols-2 mx-auto max-w-screen-lg w-full rounded-xl shadow border-[1px] overflow-hidden bg-white border-gray-100">
            <div className="md:flex flex-col items-center justify-center hidden text-white p-6 relative bg-sky-600">
                <span className="absolute top-4 left-4 text-2xl font-bold text-white">LinkUp</span>

                <img className="w-36 h-36 object-cover p-4" src={images.facebook} alt="Logo" />

                <h1 className="text-2xl font-bold mt-2">"Chia sẻ niềm vui, kết nối yêu thương!"</h1>
                <p className="text-sm text-white/80 mt-1">
                    Kết nối, chia sẻ và khám phá ngay hôm nay!
                </p>
            </div>


            <div className="col-span-2 md:col-span-1">
                <Outlet />
            </div>
        </div>
    </div>
};

export default AuthLayout;
