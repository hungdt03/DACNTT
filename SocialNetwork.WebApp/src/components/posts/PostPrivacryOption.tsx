import { Radio } from "antd";
import images from "../../assets";
import { PrivacyType } from "../../constants/privacy";
import { FC, useState } from "react";
import { User, Users } from "lucide-react";

type PostPrivacryOptionProps = {
    onChange?: (privacy: PrivacyType) => void
}

export const PostPrivacryOption: FC<PostPrivacryOptionProps> = ({
    onChange
}) => {

    const [privacy, setPrivacy] = useState<string>(PrivacyType.PUBLIC);

    const handleChangePrivacy = (privacy: PrivacyType) => {
        setPrivacy(privacy)
        onChange?.(privacy)
    }

    return <div className="flex flex-col gap-y-2">
        <Radio.Group value={privacy} onChange={(e) => handleChangePrivacy(e.target.value)}>
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
                <Radio name="privacy" value={PrivacyType.PUBLIC} />
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
                <Radio name="privacy" value={PrivacyType.FRIENDS} />
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
                <Radio name="privacy" value={PrivacyType.PRIVATE} />
            </div>
        </Radio.Group>
    </div>
}
