import { Button, Divider, Drawer, Dropdown } from "antd";
import { FC, useState } from "react";
import { CloseOutlined, SettingOutlined } from '@ant-design/icons'
import { Link } from "react-router-dom";
import images from "../../../assets";
import { StoryOption } from "../../../pages/CreateStoryPage";
import StoryTextEditor from "./StoryTextEditor";
import { useSelector } from "react-redux";
import { selectAuth } from "../../../features/slices/auth-slice";
import { PrivacyType } from "../../../enums/privacy";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";

const storyPrivacy = [
    { value: PrivacyType.PUBLIC, label: 'Công khai' },
    { value: PrivacyType.FRIENDS, label: 'Bạn bè' },
    { value: PrivacyType.PRIVATE, label: 'Chỉ mình tôi' },
];


type CreateStorySidebarProps = {
    option: StoryOption;
    content: string;
    isOpenTool: boolean;
    onChange: (value: string) => void;
    onSelectBackground: (background: string) => void;
    onFontFamilySelect: (fontFamily: string) => void;
    onPrivacySelect: (privacy: PrivacyType) => void;
    onSubmit: () => void;
    onCloseTool: () => void
}

const CreateStorySidebar: FC<CreateStorySidebarProps> = ({
    option,
    content,
    isOpenTool,
    onCloseTool,
    onChange,
    onSelectBackground,
    onFontFamilySelect,
    onSubmit,
    onPrivacySelect
}) => {
    const { user } = useSelector(selectAuth);
    const [selectPrivacy, setSelectPrivacy] = useState<number>(0);


    const handleSelectPrivacy = (index: number) => {
        setSelectPrivacy(index)
        onPrivacySelect(storyPrivacy[index].value)
    }

    return <>
        <div className="flex flex-col shadow h-full relative">
            <div className="flex items-center gap-x-2 p-3">
                <Link to='/' className="p-2 w-9 h-9 flex items-center justify-center rounded-full text-white bg-gray-500">
                    <CloseOutlined />
                </Link>
                <Link to='/'><img width='36px' height='36px' src={images.facebook} /></Link>
            </div>
            <Divider className="my-0" />
            <div className="flex flex-col gap-y-4 py-5 px-3">
                <div className="flex items-end justify-between">
                    <span className="text-2xl font-bold">Tin của bạn</span>
                </div>
                <div className="flex items-center gap-x-3">
                    <img className="rounded-full flex-shrink-0 w-[45px] h-[45px] object-cover" src={user?.avatar ?? images.user} />
                    <span className="font-semibold text-lg">{user?.fullName}</span>
                </div>
            </div>

            <div className="flex flex-col gap-y-1 p-4">
                <span className="text-[15px] font-semibold">Ai có thể xem tin của bạn</span>
                <Dropdown menu={{
                    items: storyPrivacy.map((privacy, index) => ({
                        key: privacy.value,
                        label: (
                            <div
                                onClick={() => handleSelectPrivacy(index)}
                                className="px-2 py-1 cursor-pointer"
                            >
                                {privacy.label}
                            </div>
                        ),
                    })),
                }}
                    placement="bottomRight" arrow>
                    <button className="flex items-center justify-between p-3 rounded-md border-[1px] border-gray-300">
                        <div className="flex items-center gap-x-2">
                            <span style={{
                            }} className="text-gray-600">{storyPrivacy[selectPrivacy].label}</span>
                        </div>

                        <FontAwesomeIcon className="text-gray-600" icon={faCaretDown} />
                    </button>
                </Dropdown>
            </div>

            <Divider className="my-0" />

            <div className="p-3">
                {option === 'text' && <StoryTextEditor
                    onFontFamilySelect={onFontFamilySelect}
                    onSelectBackground={onSelectBackground}
                    value={content}
                    onChange={onChange}
                />}
            </div>

            {option === 'text' && <div className="absolute flex items-center justify-center gap-x-3 left-0 right-0 bottom-0 py-4 border-t-[1px] border-gray-100">
                <button className="bg-gray-100 border-[1px] py-1 rounded-md text-gray-400 hover:bg-gray-200 px-4">Bỏ</button>
                <button onClick={() => onSubmit()} className="bg-sky-400 hover:bg-primary text-white py-1 px-4 rounded-md">Chia sẻ lên tin</button>
            </div>}
        </div>

        <Drawer title="Tin văn bản" onClose={onCloseTool} open={isOpenTool}>
            <StoryTextEditor
                onFontFamilySelect={onFontFamilySelect}
                onSelectBackground={onSelectBackground}
                value={content}
                onChange={onChange}
            />
            {option === 'text' && <div className="absolute flex items-center justify-center gap-x-3 left-0 right-0 bottom-0 py-4 border-t-[1px] border-gray-100">
                <button className="bg-gray-100 border-[1px] py-1 rounded-md text-gray-400 hover:bg-gray-200 px-4">Bỏ</button>
                <button onClick={() => onSubmit()} className="bg-sky-400 hover:bg-primary text-white py-1 px-4 rounded-md">Chia sẻ lên tin</button>
            </div>}
        </Drawer>

    </>
};
export default CreateStorySidebar;
