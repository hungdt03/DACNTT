import { Button, Divider } from "antd";
import { FC } from "react";
import { CloseOutlined, SettingOutlined } from '@ant-design/icons'
import { Link } from "react-router-dom";
import images from "../../assets";
import { StoryOption } from "../../pages/CreateStoryPage";
import TextEditor from "./TextEditor";
import { useSelector } from "react-redux";
import { selectAuth } from "../../features/slices/auth-slice";

type CreateStorySidebarProps = {
    option: StoryOption;
    content: string;
    onChange: (value: string) => void;
    onSelectBackground: (background: string) => void;
    onFontFamilySelect: (fontFamily: string) => void;
    onSubmit: () => void
}

const CreateStorySidebar: FC<CreateStorySidebarProps> = ({
    option,
    content,
    onChange,
    onSelectBackground,
    onFontFamilySelect,
    onSubmit
}) => {
    const { user } = useSelector(selectAuth)
    return <div className="flex flex-col shadow h-full relative">
        <div className="flex items-center gap-x-2 p-3">
            <Link to='/' className="p-2 w-9 h-9 flex items-center justify-center rounded-full text-white bg-gray-300">
                <CloseOutlined />
            </Link>
            <Link to='/'><img width='36px' height='36px' src={images.facebook} /></Link>
        </div>
        <Divider className="my-0" />
        <div className="flex flex-col gap-y-4 py-5 px-3">
            <div className="flex items-end justify-between">
                <span className="text-2xl font-bold">Tin của bạn</span>
                <Button shape="circle" icon={<SettingOutlined />}></Button>
            </div>
            <div className="flex items-center gap-x-3">
                <img className="rounded-full flex-shrink-0 w-[45px] h-[45px] object-cover" src={user?.avatar ?? images.user} />
                <span className="font-semibold text-lg">{user?.fullName}</span>
            </div>
        </div>
        <Divider />

        <div className="p-3">
            {option === 'text' && <TextEditor onFontFamilySelect={onFontFamilySelect} onSelectBackground={onSelectBackground} value={content} onChange={onChange} />}
        </div>

        {option === 'text' && <div className="absolute flex items-center justify-center gap-x-3 left-0 right-0 bottom-0 py-4 border-t-[1px] border-gray-100">
            <button className="bg-gray-100 border-[1px] py-1 rounded-md text-gray-400 px-4">Bỏ</button>
            <button onClick={() => onSubmit()} className="bg-sky-300 text-white py-1 px-4 rounded-md">Chia sẻ lên tin</button>
        </div>}
    </div>
};

export default CreateStorySidebar;
