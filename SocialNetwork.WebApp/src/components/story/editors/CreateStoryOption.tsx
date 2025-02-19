import { FC } from "react";
import images from "../../../assets";
import { CaseSensitive, Images } from "lucide-react";
import { isValidImage } from "../../../utils/file";
import { message } from "antd";

type CreateStoryOptionProps = {
    onText?: () => void;
    onImage?: (file: File) => void;
}

const CreateStoryOption: FC<CreateStoryOptionProps> = ({
    onText,
    onImage
}) => {
    return <div className="flex items-center sm:gap-x-6 gap-x-3">
        <label htmlFor="fileStory" style={{
            backgroundImage: `url(${images.bgStoryText})`,
            backgroundPosition: '0px 0px',
            backgroundSize: 'auto'
        }} className="px-6 flex items-center rounded-lg justify-center sm:w-[220px] sm:h-[330px] w-[150px] h-[225px] bg-no-repeat cursor-pointer">
            <div className="flex flex-col gap-y-2 items-center">
                <div className="p-2 rounded-full bg-white border-[1px] border-gray-100 shadow">
                    <Images />
                </div>
                <span className="font-semibold text-white w-full text-center">Tạo tin dạng ảnh</span>
            </div>
        </label>
        <input accept="image/*" 
            onChange={(e) => {
                const file = e.target.files?.[0]; 

                if (file && !isValidImage(file)) {
                    message.error('Vui lòng chọn file ảnh')
                    return false;
                }

                if (file && onImage) {
                    onImage(file);
                }
            }} hidden type="file" id="fileStory" />

        <div onClick={onText} style={{
            backgroundImage: `url(${images.bgStoryImage})`,
            backgroundPosition: '0px -331px',
            backgroundSize: 'auto'
        }} className="px-6 flex items-center justify-center rounded-lg sm:w-[220px] sm:h-[330px] w-[150px] h-[225px] bg-no-repeat cursor-pointer">
            <div className="flex flex-col gap-y-2 items-center">
                <div className="p-2 rounded-full bg-white border-[1px] border-gray-100 shadow">
                    <CaseSensitive />
                </div>
                <span className="font-semibold text-white w-full text-center">Tạo tin dạng văn bản</span>
            </div>
        </div>
    </div>
};

export default CreateStoryOption;
