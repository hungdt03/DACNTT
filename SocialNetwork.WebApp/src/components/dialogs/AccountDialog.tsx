import { Avatar, Divider, Modal, Popconfirm } from "antd";
import { FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectAuth, signOut } from "../../features/slices/auth-slice";
import { CircleUserRound, LogOut, ShieldBan } from "lucide-react";
import { AppDispatch } from "../../app/store";
import { Link } from "react-router-dom";
import useModal from "../../hooks/useModal";
import BlockListModal from "../modals/BlockListModal";
import AccountSettingModal from "../modals/AccountSettingModal";

const AccountDialog: FC = () => {
    const { user } = useSelector(selectAuth);
    const dispatch = useDispatch<AppDispatch>();
    const { handleCancel, handleOk, isModalOpen, showModal } = useModal()
    const { handleCancel:cancelSetting, handleOk:okSetting, isModalOpen:openSetting, showModal:showSetting } = useModal()

    const handleLogout = () => dispatch(signOut())

    return <>
        <div className="flex flex-col gap-y-2">
            <div className="p-3 rounded-md shadow">
                <div className="flex items-center gap-x-2">
                    <Avatar src={user?.avatar} size={"large"} />
                    <span className="font-semibold text-[15px]">{user?.fullName}</span>
                </div>
                <Divider className="mt-2 mb-3" />
                <Link to={`/profile/${user?.id}`}>
                    <span className="px-2 py-1 rounded-md bg-gray-200 text-gray-800 font-semibold w-full">Xem trang cá nhân</span>
                </Link>
            </div>
            <div onClick={showSetting} className="px-2 py-2 rounded-md hover:bg-gray-100 flex items-center gap-x-2 cursor-pointer">
                <div className="p-1 rounded-full bg-gray-200 border-[1px] border-gray-300">
                    <CircleUserRound className="font-semibold" size={15} />
                </div>
                <span className="font-semibold text-[15px]">Tài khoản</span>
            </div>

            <div onClick={showModal} className="px-2 py-2 rounded-md hover:bg-gray-100 flex items-center gap-x-2 cursor-pointer">
                <div className="p-1 rounded-full bg-gray-200 border-[1px] border-gray-300">
                    <ShieldBan className="font-semibold" size={15} />
                </div>
                <span className="font-semibold text-[15px]">Danh sách chặn</span>
            </div>
            <Popconfirm onConfirm={handleLogout} title='Đăng xuất' description='Bạn có chắc là muốn đăng xuất?' cancelText='Không' okText='Chắc chắn' >

                <div className="px-2 py-2 rounded-md hover:bg-gray-100 flex items-center gap-x-2 cursor-pointer">
                    <div className="p-1 rounded-full bg-gray-200 border-[1px] border-gray-300">
                        <LogOut className="font-semibold" size={15} />
                    </div>
                    <span className="font-semibold text-[15px]">Đăng xuất</span>
                </div>
            </Popconfirm>
        </div>

        {/* BLOCK LIST */}
        <Modal
            style={{
                top: 20
            }}
            title={<p className="text-center font-bold text-lg">Danh sách chặn</p>}
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            classNames={{
                footer: 'hidden'
            }}
        >
            <BlockListModal />
        </Modal>

        {/* ACCOUNT SETTING */}
        <Modal
           centered
            title={<p className="text-center font-bold text-lg">Tài khoản</p>}
            open={openSetting}
            onOk={okSetting}
            onCancel={cancelSetting}
            classNames={{
                footer: 'hidden'
            }}
        >
            <AccountSettingModal />
        </Modal>
    </>
};

export default AccountDialog;
