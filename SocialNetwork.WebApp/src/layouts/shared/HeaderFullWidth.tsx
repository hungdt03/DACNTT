import { FC } from "react";
import images from "../../assets";
import { Search } from "lucide-react";
import Navbar from "./Navbar";
import { Link } from "react-router-dom";

const HeaderFullWidth: FC = () => {
    return <div className="sticky z-50 top-0 shadow w-full bg-white h-[70px] flex items-center">
        <div className="w-full flex items-center justify-between py-6 px-4">
            <div className="flex items-center gap-x-4">
                <Link to='/'><img width='36px' height='36px' src={images.facebook} /></Link>

                <div className="flex items-center gap-x-4 px-3 py-3 md:py-[6px] rounded-md border-[1px] bg-gray-100 border-slate-100">
                    <Search size={18} />
                    <input className="hidden md:block border-none outline-none bg-gray-100" placeholder="Tìm kiếm ở đây ..." />
                </div>
            </div>
            <Navbar />
        </div>
    </div>
};

export default HeaderFullWidth;
