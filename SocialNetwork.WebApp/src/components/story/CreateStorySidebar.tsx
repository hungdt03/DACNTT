import { Button, Divider } from "antd";
import { FC } from "react";
import { CloseOutlined, SettingOutlined } from '@ant-design/icons'
import { Link } from "react-router-dom";
import images from "../../assets";
import { StoryOption } from "../../pages/CreateStoryPage";
import TextEditor from "./TextEditor";

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
    return <div className="flex flex-col shadow h-full relative">
        <div className="flex items-center gap-x-2 p-3">
            <Button shape="circle" icon={<CloseOutlined />}>
            </Button>
            <Link to='/'><img width='36px' height='36px' src={images.facebook} /></Link>
        </div>
        <Divider className="my-0" />
            <div className="flex flex-col gap-y-4 py-5 px-3">
                <div className="flex items-end justify-between">
                    <span className="text-2xl font-bold">Tin của bạn</span>
                    <Button shape="circle" icon={<SettingOutlined />}></Button>
                </div>
                <div className="flex items-center gap-x-3">
                    <img width={45} src={images.user} />
                    <span className="font-semibold text-lg">Đạo Thanh Hưng</span>
                </div>
            </div>
        <Divider />

        <div className="p-3">
            {option === 'text' && <TextEditor onFontFamilySelect={onFontFamilySelect} onSelectBackground={onSelectBackground} value={content} onChange={onChange} />}
        </div>

        {option === 'text' && <div className="absolute flex items-center justify-center gap-x-3 left-0 right-0 bottom-0 py-4 border-t-[1px] border-gray-100">
            <button className="bg-red-100 border-[1px] border-red-600 py-1 rounded-md text-red-600 px-4">Bỏ</button>
            <button onClick={() => onSubmit()} className="bg-sky-100 border-[1px] border-primary text-sky-500 py-1 px-4 rounded-md">Chia sẻ lên tin</button>
        </div>}
    </div>
};

export default CreateStorySidebar;
