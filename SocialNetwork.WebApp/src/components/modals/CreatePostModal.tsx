import { Avatar, Modal, Popover, Radio, Tooltip } from "antd";
import { FC, useState } from "react";
import images from "../../assets";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown } from '@fortawesome/free-solid-svg-icons'
import { Lock, User, Users } from "lucide-react";
import UploadMultipleFile from "../uploads/UploadMultiFile";
import useModal from "../../hooks/useModal";
import TagFriendModal from "./TagFriendModal";

export const PostPrivacryOption: FC = () => {
    return <div className="flex flex-col gap-y-2">
        <div className="flex items-center justify-between gap-x-6 px-2 py-1 rounded-md hover:bg-gray-100">
            <div className="flex items-center gap-x-2">
                <div className="w-12 h-12 flex items-center justify-center p-3 rounded-full bg-sky-100">
                    <img className="w-5 h-5" src={images.earth} />
                </div>
                <div className="flex flex-col">
                    <span className="font-semibold text-[18px]">Công khai</span>
                    <p className="text-gray-500">Bất kì ai ở trên hoặc ngoài Facebook</p>
                </div>
            </div>
            <Radio />
        </div>
        <div className="flex items-center justify-between gap-x-6 px-2 py-1 rounded-md hover:bg-gray-100">
            <div className="flex items-center gap-x-2">
                <div className="w-12 h-12 flex items-center justify-center p-3 rounded-full bg-sky-100">
                    <Users size={20} />
                </div>
                <div className="flex flex-col">
                    <span className="font-semibold text-[18px]">Bạn bè</span>
                    <p className="text-gray-500">Bạn bè của bạn, bất kì ai được gắn thẻ và bạn bè của họ</p>
                </div>
            </div>
            <Radio />
        </div>
        <div className="flex items-center justify-between gap-x-6 px-2 py-1 rounded-md hover:bg-gray-100">
            <div className="flex items-center gap-x-2">
                <div className="w-12 h-12 flex items-center justify-center p-3 rounded-full bg-sky-100">
                    <User size={20} />
                </div>
                <div className="flex flex-col">
                    <span className="font-semibold text-[18px]">Chỉ mình tôi</span>
                    <p className="text-gray-500">Chỉ mình bạn mới thấy bài viết này</p>
                </div>
            </div>
            <Radio />
        </div>
    </div>
}

const CreatePostModal: FC = () => {
    const [showUpload, setShowUpload] = useState(false);
    const { isModalOpen: openTagFriend, handleCancel: cancelTagFriend, showModal: showTagFriend, handleOk: okTagFriend } = useModal()

    const handleShowUploadBtn = () => {
        setShowUpload(true)
    }

    return <div className="flex flex-col gap-y-4">
        <div className="flex items-center gap-x-2">
            <Avatar size='large' src={images.user} />
            <div className="flex flex-col items-start gap-y-[1px] mb-1">
                <span className="text-[16px] font-semibold">Nguyễn Lâm Thành Long</span>
                <Popover trigger='click' content={<PostPrivacryOption />}>
                    <button className="flex items-center gap-x-2 font-semibold text-gray-700 py-[1px] px-2 bg-gray-100 rounded-sm">
                        <Lock size={14} />
                        <span className="text-[13px]">Chỉ mình tôi</span>
                        <FontAwesomeIcon icon={faCaretDown} />
                    </button>
                </Popover>
            </div>
        </div>
        <div className="flex flex-col gap-y-2">
            <div className="w-full">
                <textarea className="text-xl outline-none border-none w-full min-h-[120px] max-h-[240px] overflow-y-auto custom-scrollbar" rows={8} placeholder="Long ơi, bạn đang nghĩ gì thế" />
            </div>
            {showUpload && <UploadMultipleFile />}
            <div className="p-2 rounded-md border-[1px] border-gray-200 flex justify-between items-center">
                <span>Thêm vào bài viết của bạn</span>
                <div className="flex items-center gap-x-1">
                    <Tooltip title='Ảnh/video'>
                        <button onClick={handleShowUploadBtn} className="p-2 rounded-full hover:bg-gray-100">
                            <img className="w-6 h-6" src={images.photo} />
                        </button>
                    </Tooltip>
                    <Tooltip title='Gắn thẻ người khác'>
                        <button onClick={showTagFriend} className="p-2 rounded-full hover:bg-gray-100">
                            <img className="w-7 h-7" src={images.tagFriend} />
                        </button>
                    </Tooltip>
                </div>
            </div>
        </div>
        <button className="py-[5px] w-full rounded-md font-semibold text-[16px] text-white bg-sky-500">Đăng</button>

        <Modal title={<p className="text-center font-semibold text-xl">Gắn thẻ người khác</p>} footer={[]} open={openTagFriend} onOk={okTagFriend} onCancel={cancelTagFriend}>
            <TagFriendModal />
        </Modal>
    </div>
};

export default CreatePostModal;
