import { FC } from "react";
import images from "../../assets";
import { Search } from "lucide-react";
import Navbar from "./Navbar";

const Header: FC = () => {
    return <div className="sticky z-50 top-0 shadow w-full bg-white h-[70px] flex items-center">
        <div className="w-full flex items-center justify-between py-6 px-4 lg:px-0 max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl mx-auto">
            <div className="flex items-center gap-x-4">
                <img width='36px' height='36px' src={images.facebook} />

                <div className="flex items-center gap-x-4 px-3 py-3 md:py-[6px] rounded-md border-[1px] bg-gray-100 border-slate-100">
                    <Search size={18} />
                    <input className="hidden md:block border-none outline-none bg-gray-100" placeholder="Tìm kiếm ở đây ..." />
                </div>
            </div>
            <Navbar />
        </div>
    </div>
};

export default Header;
