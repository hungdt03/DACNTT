import { FC } from "react";
import images from "../../assets";
import Navbar from "./Navbar";
import { Link } from "react-router-dom";
import BoxSearchHeader from "./BoxSearchHeader";

const HeaderFullWidth: FC = () => {
    return <div className="sticky z-[100] top-0 shadow w-full bg-white h-[70px] flex items-center">
        <div className="w-full flex items-center gap-x-2 sm:gap-x-0 justify-between py-6 px-4">
            <div className="flex items-center gap-x-2 md:gap-x-4">
                <Link className="flex-shrink-0" to='/'><img className="object-cover md:w-[36px] md:h-[36px] w-[30px] h-[30px]" src={images.facebook} /></Link>
                <BoxSearchHeader />
            </div>
            <Navbar />
        </div>
    </div>
};

export default HeaderFullWidth;
