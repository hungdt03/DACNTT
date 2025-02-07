import { User, Users } from "lucide-react";
import { FC, useState } from "react";
import { PrivacyType } from "../../enums/privacy";
import images from "../../assets";
import { Radio } from "antd";

type ChangePostPrivacyModalProps = {
    privacy: PrivacyType;
    onChange?: (privacy: PrivacyType) => void
}

const ChangePostPrivacyModal: FC<ChangePostPrivacyModalProps> = ({
    privacy: param,
    onChange
}) => {

    const [privacy, setPrivacy] = useState<PrivacyType>(param);

    const handleChangePrivacy = (privacy: PrivacyType) => {
        setPrivacy(privacy)
        onChange?.(privacy)
    }

    return <div className="flex flex-col gap-y-5">
        <div>
            <span className="text-lg font-bold">Ai có thể xem bài viết của bạn?</span>
            <p className="text-[15px] text-gray-600">Bài viết của bạn có thể hiển thị trên Bảng tin, trang cá nhân của bạn, trong kết quả tìm kiếm</p>
        </div>
        <Radio.Group className="flex flex-col gap-y-2" value={privacy} onChange={(e) => handleChangePrivacy(e.target.value)}>
            <div className="flex items-center justify-between gap-x-6 px-2 py-2 rounded-md hover:bg-gray-100">
                <div className="flex items-center gap-x-2">
                    <div className="w-8 h-8 flex items-center justify-center p-1 rounded-full bg-sky-100">
                        <img className="w-4 h-4" src={images.earth} />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-semibold text-[14px]">Công khai</span>
                        <p className="text-gray-500">Bất kì ai ở trên hoặc ngoài Facebook</p>
                    </div>
                </div>
                <Radio name="privacy" value={PrivacyType.PUBLIC} />
            </div>
            <div className="flex items-center justify-between gap-x-6 px-2 py-2 rounded-md hover:bg-gray-100">
                <div className="flex items-center gap-x-2">
                    <div className="w-8 h-8 flex items-center justify-center p-1 rounded-full bg-sky-100">
                        <Users size={14} />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-semibold text-[14px]">Bạn bè</span>
                        <p className="text-gray-500">Bạn bè của bạn, bất kì ai được gắn thẻ và bạn bè của họ</p>
                    </div>
                </div>
                <Radio name="privacy" value={PrivacyType.FRIENDS} />
            </div>
            <div className="flex items-center justify-between gap-x-6 px-2 py-2 rounded-md hover:bg-gray-100">
                <div className="flex items-center gap-x-2">
                    <div className="w-8 h-8 flex items-center justify-center p-1 rounded-full bg-sky-100">
                        <User size={14} />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-semibold text-[14px]">Chỉ mình tôi</span>
                        <p className="text-gray-500">Chỉ mình bạn mới thấy bài viết này</p>
                    </div>
                </div>
                <Radio name="privacy" value={PrivacyType.PRIVATE} />
            </div>
        </Radio.Group>
    </div>
};

export default ChangePostPrivacyModal;
