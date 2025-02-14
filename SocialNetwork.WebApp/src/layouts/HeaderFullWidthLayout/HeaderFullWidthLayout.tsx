import { FC } from "react";
import { Outlet } from "react-router-dom";
import HeaderFullWidth from "../shared/HeaderFullWidth";
import PopupWrapper from "../../components/chats/PopupWrapper";
import MinimizePopupWrapper from "../../components/chats/MinimizePopupWrapper";

const HeaderFullWidthLayout: FC = () => {
    return <div className="flex flex-col bg-slate-100 h-screen w-screen overflow-hidden">
        <HeaderFullWidth />
        <Outlet />

        <div className="absolute right-24 bottom-0 flex gap-x-4">
            <PopupWrapper />
        </div>

        <div className="absolute right-8 bottom-8 flex gap-x-4">
            <div className="flex flex-col gap-2">
                <MinimizePopupWrapper />
            </div>
        </div>
    </div>
};

export default HeaderFullWidthLayout;
