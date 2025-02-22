import { FC } from "react";
import images from "../../assets";
import Navbar from "./Navbar";
import { Link } from "react-router-dom";
import BoxSearchHeader from "./BoxSearchHeader";

const Header: FC = () => {
    return <div className="sticky z-[100] top-0 shadow w-full bg-white h-[70px] flex items-center">
        <div className="w-full flex items-center justify-between gap-x-2 md:gap-x-0 py-6 px-1 sm:px-4 lg:px-0 max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl mx-auto">
            <div className="flex items-center gap-x-2 md:gap-x-4">
                <Link className="flex-shrink-0" to='/'><img className="md:w-[36px] md:h-[36px] w-[30px] h-[30px] object-cover" src={images.facebook} /></Link>
                <BoxSearchHeader />
            </div>
            <Navbar />
        </div>
    </div>
};

export default Header;
