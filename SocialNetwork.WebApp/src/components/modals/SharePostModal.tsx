import { Avatar, Modal, Popover } from "antd";
import { FC } from "react";
import images from "../../assets";
import { PostPrivacryOption } from "./CreatePostModal";
import { Lock } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import TagFriendModal from "./TagFriendModal";
import useModal from "../../hooks/useModal";

const SharePostModal: FC = () => {
    const { isModalOpen: openTagFriend, handleCancel: cancelTagFriend, showModal: showTagFriend, handleOk: okTagFriend } = useModal()

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
                <textarea className="text-xl outline-none border-none w-full" rows={4} placeholder="Long ơi, bạn đang nghĩ gì thế" />
            </div>
           
        </div>
        <button className="py-[5px] w-full rounded-md font-semibold text-[16px] text-white bg-sky-500">Chia sẻ</button>

        <Modal title={<p className="text-center font-semibold text-xl">Gắn thẻ người khác</p>} footer={[]} open={openTagFriend} onOk={okTagFriend} onCancel={cancelTagFriend}>
            <TagFriendModal />
        </Modal>
    </div>
};

export default SharePostModal;
