import { FC } from "react";
import images from "../../assets";
import Navbar from "./Navbar";
import { Link } from "react-router-dom";
import BoxSearchHeader from "./BoxSearchHeader";

const HeaderFullWidth: FC = () => {
    return <div className="sticky z-50 top-0 shadow w-full bg-white h-[70px] flex items-center">
        <div className="w-full flex items-center justify-between py-6 px-4">
            <div className="flex items-center gap-x-4">
                <Link to='/'><img width='36px' height='36px' src={images.facebook} /></Link>
                <BoxSearchHeader />
            </div>
            <Navbar />
        </div>
    </div>
};

export default HeaderFullWidth;
